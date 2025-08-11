import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle, AlertCircle, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function CrawlProgress({ websites }) {
  const activeCrawls = websites.filter(w => w.status === 'crawling' || w.status === 'pending');

  if (activeCrawls.length === 0) return null;

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Activity className="w-5 h-5" />
          Active Crawls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeCrawls.map((website) => {
            const progress = website.pages_found > 0 
              ? (website.pages_crawled / website.pages_found) * 100 
              : 0;

            return (
              <motion.div
                key={website.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl border-2 border-slate-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{website.name}</h4>
                      <p className="text-sm text-slate-500">{website.url}</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                    {website.status === 'crawling' ? 'Crawling' : 'Pending'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Progress</span>
                    <span>{website.pages_crawled} / {website.pages_found || '?'} pages</span>
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-2"
                  />
                </div>

                {website.status === 'crawling' && (
                  <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>{website.pages_crawled} processed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <span>{(website.errors_404?.length || 0) + (website.seo_issues?.length || 0)} issues</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}