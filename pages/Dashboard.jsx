import React, { useState, useEffect } from "react";
import { Website } from "@/entities/Website";
import { Globe, AlertTriangle, ArrowRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "../components/dashboard/StatCard";
import RecentCrawls from "../components/dashboard/RecentCrawls";

export default function Dashboard() {
  const [websites, setWebsites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const websiteData = await Website.list("-created_date");
      setWebsites(websiteData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const getStats = () => {
    const completed = websites.filter(w => w.status === 'completed');
    const total404s = completed.reduce((sum, w) => sum + (w.errors_404?.length || 0), 0);
    const total301s = completed.reduce((sum, w) => sum + (w.redirects_301?.length || 0), 0);
    const totalSeoIssues = completed.reduce((sum, w) => sum + (w.seo_issues?.length || 0), 0);

    return {
      totalWebsites: websites.length,
      total404s,
      total301s,
      totalSeoIssues,
      activeCrawls: websites.filter(w => w.status === 'crawling').length
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            Website Analysis Dashboard
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Monitor your websites for broken links, redirects, and SEO optimization opportunities.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Websites"
            value={stats.totalWebsites}
            subtitle="Monitored sites"
            icon={Globe}
            color="slate"
          />
          <StatCard
            title="404 Errors"
            value={stats.total404s}
            subtitle="Broken links found"
            icon={AlertTriangle}
            color="red"
          />
          <StatCard
            title="301 Redirects"
            value={stats.total301s}
            subtitle="Redirects detected"
            icon={ArrowRight}
            color="amber"
          />
          <StatCard
            title="SEO Issues"
            value={stats.totalSeoIssues}
            subtitle="Optimization opportunities"
            icon={TrendingUp}
            color="emerald"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecentCrawls websites={websites} isLoading={isLoading} />
          </div>
          
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border-2 border-slate-200"
            >
              <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                  <div className="font-medium text-slate-900">Start New Crawl</div>
                  <div className="text-sm text-slate-500">Analyze a website for issues</div>
                </button>
                <button className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                  <div className="font-medium text-slate-900">View All Reports</div>
                  <div className="text-sm text-slate-500">See detailed analysis results</div>
                </button>
                <button className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                  <div className="font-medium text-slate-900">Export Data</div>
                  <div className="text-sm text-slate-500">Download crawl results</div>
                </button>
              </div>
            </motion.div>

            {/* Health Overview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 border-2 border-slate-200"
            >
              <h3 className="font-bold text-slate-900 mb-4">Website Health</h3>
              {websites.filter(w => w.status === 'completed').slice(0, 3).map((website, index) => {
                const issueCount = (website.errors_404?.length || 0) + 
                                 (website.redirects_301?.length || 0) + 
                                 (website.seo_issues?.length || 0);
                const healthScore = Math.max(0, 100 - issueCount * 5);
                
                return (
                  <div key={website.id} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-slate-900 text-sm">{website.name}</span>
                      <span className={`text-sm font-bold ${
                        healthScore >= 80 ? 'text-emerald-600' : 
                        healthScore >= 60 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {healthScore}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          healthScore >= 80 ? 'bg-emerald-500' : 
                          healthScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${healthScore}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}