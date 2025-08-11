import React, { useState, useEffect } from "react";
import { Website } from "@/entities/Website";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, ArrowRight, Search, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "../components/dashboard/StatCard";
import IssueTable from "../components/reports/IssueTable";

export default function Reports() {
  const [websites, setWebsites] = useState([]);
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWebsites();
  }, []);

  const loadWebsites = async () => {
    setIsLoading(true);
    try {
      const data = await Website.list("-created_date");
      const completedWebsites = data.filter(w => w.status === 'completed');
      setWebsites(completedWebsites);
      if (completedWebsites.length > 0 && !selectedWebsite) {
        setSelectedWebsite(completedWebsites[0]);
      }
    } catch (error) {
      console.error("Error loading websites:", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-slate-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (websites.length === 0) {
    return (
      <div className="min-h-screen p-6 md:p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <BarChart3 className="w-16 h-16 text-slate-300 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">No Reports Available</h2>
          <p className="text-slate-600 max-w-md">
            You need to complete at least one website crawl to view reports. Start by crawling a website first.
          </p>
        </div>
      </div>
    );
  }

  const getWebsiteStats = (website) => {
    if (!website) return { errors404: 0, redirects301: 0, seoIssues: 0 };
    
    return {
      errors404: website.errors_404?.length || 0,
      redirects301: website.redirects_301?.length || 0,
      seoIssues: website.seo_issues?.length || 0
    };
  };

  const stats = getWebsiteStats(selectedWebsite);

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            Website Reports
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl">
            Detailed analysis of your website crawl results and optimization opportunities.
          </p>
        </motion.div>

        {/* Website Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border-2 border-slate-200"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Select Website</h2>
            <Select 
              value={selectedWebsite?.id} 
              onValueChange={(value) => {
                const website = websites.find(w => w.id === value);
                setSelectedWebsite(website);
              }}
            >
              <SelectTrigger className="w-72">
                <SelectValue placeholder="Choose a website" />
              </SelectTrigger>
              <SelectContent>
                {websites.map((website) => (
                  <SelectItem key={website.id} value={website.id}>
                    {website.name} - {website.url}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {selectedWebsite && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="404 Errors"
                value={stats.errors404}
                subtitle="Broken links found"
                icon={AlertCircle}
                color="red"
              />
              <StatCard
                title="301 Redirects"
                value={stats.redirects301}
                subtitle="Redirects detected"
                icon={ArrowRight}
                color="amber"
              />
              <StatCard
                title="SEO Issues"
                value={stats.seoIssues}
                subtitle="Optimization opportunities"
                icon={Search}
                color="emerald"
              />
            </div>

            {/* Issue Tables */}
            <div className="space-y-8">
              <IssueTable
                title="404 Errors"
                icon={AlertCircle}
                data={selectedWebsite.errors_404}
                type="404"
              />
              
              <IssueTable
                title="301 Redirects"
                icon={ArrowRight}
                data={selectedWebsite.redirects_301}
                type="301"
              />
              
              <IssueTable
                title="SEO Issues"
                icon={Search}
                data={selectedWebsite.seo_issues}
                type="seo"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}