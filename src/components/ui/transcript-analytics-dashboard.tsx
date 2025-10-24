import * as React from 'react';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  History,
  GraduationCap,
  Search,
} from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- UTILS ---
function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

// --- TYPE DEFINITIONS ---
type QuickAction = {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick?: () => void;
};

type Activity = {
  icon: React.ReactNode;
  title: string;
  time: string;
  gpa: number;
};

type Service = {
  icon: React.ElementType;
  title: string;
  description: string;
  isPremium?: boolean;
  hasAction?: boolean;
};

interface TranscriptAnalyticsDashboardProps {
  quickActions: QuickAction[];
  recentActivity: Activity[];
  gradingServices: Service[];
}

// --- HELPER COMPONENTS ---
const IconWrapper = ({
  icon: Icon,
  className,
}: {
  icon: React.ElementType;
  className?: string;
}) => (
  <div
    className={cn(
      'p-2 rounded-full flex items-center justify-center',
      className
    )}
  >
    <Icon className="w-5 h-5" />
  </div>
);

// --- MAIN COMPONENT ---
export const TranscriptAnalyticsDashboard: React.FC<TranscriptAnalyticsDashboardProps> = ({
  quickActions,
  recentActivity,
  gradingServices,
}) => {
  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={containerVariants}
      className="bg-card text-card-foreground rounded-2xl border-2 border-orange-200 dark:border-orange-900/50 shadow-xl max-w-4xl mx-auto font-sans"
    >
      <div className="p-4 md:p-6">
        {/* Search Bar */}
        <motion.div variants={itemVariants} className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transcripts, students, or type a command..."
            className="bg-background w-full border-2 border-orange-200 dark:border-orange-900/50 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-background outline-none transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center justify-center text-xs font-mono text-muted-foreground bg-muted p-1 rounded-md">
            ⌘K
          </kbd>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
        >
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, backgroundColor: 'hsl(var(--muted))' }}
              onClick={action.onClick}
              className="group text-center p-3 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-orange-300 dark:hover:border-orange-700"
            >
              <IconWrapper
                icon={action.icon}
                className="mx-auto mb-2 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 text-orange-700 dark:text-orange-300 group-hover:from-orange-200 group-hover:to-orange-300 dark:group-hover:from-orange-800/60 dark:group-hover:to-orange-700/60"
              />
              <p className="text-sm font-medium">{action.title}</p>
              <p className="text-xs text-muted-foreground">
                {action.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h2 className="text-sm font-semibold">Recent Activity</h2>
          </div>
          <motion.ul
            variants={containerVariants}
            className="space-y-4"
          >
            {recentActivity.map((activity, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                className="flex items-center justify-between bg-gradient-to-r from-orange-50/50 to-transparent dark:from-orange-900/10 dark:to-transparent p-3 rounded-lg border border-orange-100 dark:border-orange-900/30"
              >
                <div className="flex items-center gap-3">
                  {React.isValidElement(activity.icon) ? (
                    activity.icon
                  ) : (
                    <IconWrapper
                      icon={activity.icon as React.ElementType}
                      className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                    />
                  )}
                  <div>
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    'text-sm font-mono px-3 py-1 rounded-full font-semibold',
                    activity.gpa >= 3.5
                      ? 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40'
                      : activity.gpa >= 2.5
                      ? 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40'
                      : 'text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/40'
                  )}
                >
                  GPA: {activity.gpa.toFixed(2)}
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Grading Services */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h2 className="text-sm font-semibold">Grading Schemes</h2>
          </div>
          <motion.div
            variants={containerVariants}
            className="space-y-2"
          >
            {gradingServices.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0px 4px 12px hsla(var(--foreground), 0.08)',
                }}
                className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all bg-gradient-to-r from-purple-50/50 to-orange-50/50 dark:from-purple-900/10 dark:to-orange-900/10 border border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700"
              >
                <div className="flex items-center gap-3">
                  <IconWrapper
                    icon={service.icon}
                    className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                  />
                  <div>
                    <p className="font-medium text-sm flex items-center gap-2">
                      {service.title}
                      {service.isPremium && (
                        <span className="text-xs font-semibold text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/40 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                </div>
                {service.hasAction && (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};
