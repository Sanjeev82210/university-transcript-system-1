"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ArrowRight, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";

interface HeroGeometricProps {
  badge?: string;
  title1?: string;
  title2?: string;
}

export default function HeroGeometric({
  badge = "University Transcript System",
  title1 = "Manage Student Transcripts",
  title2 = "Secure Grading & Reports",
}: HeroGeometricProps) {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error?.code) {
      toast.error(error.code);
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      toast.success("Signed out successfully");
      router.push("/");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Auth Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-gray-900 dark:text-white">Transcript System</span>
            </div>

            {/* Auth Buttons - Show skeleton while loading */}
            <div className="flex items-center gap-3">
              {isPending ? (
                // Loading skeleton
                <div className="flex items-center gap-3">
                  <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              ) : session?.user ? (
                <>
                  {/* User Info */}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  {/* Sign Out Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="border-gray-300 dark:border-gray-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  {/* Sign In Button */}
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  {/* Register Button */}
                  <Link href="/register">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Animated Geometric Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Circle */}
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Medium Circle */}
        <motion.div
          className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Small Circle */}
        <motion.div
          className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating Geometric Shapes */}
        <motion.div
          className="absolute top-1/4 right-1/3 w-16 h-16 border-2 border-blue-300/40 dark:border-blue-400/40"
          animate={{
            rotate: [0, 360],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-12 h-12 bg-gradient-to-br from-indigo-300/30 to-purple-300/30 dark:from-indigo-400/30 dark:to-purple-400/30 rounded-lg"
          animate={{
            rotate: [0, -360],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-2/3 right-1/4 w-20 h-20 border-2 border-purple-300/40 dark:border-purple-400/40 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge 
              variant="outline" 
              className="px-4 py-2 text-sm font-medium border-blue-300 dark:border-blue-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
            >
              <GraduationCap className="w-4 h-4 mr-2 inline-block" />
              {badge}
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
              {title1}
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-gray-100">
              {title2}
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            Comprehensive transcript management system for educational institutions. 
            Create, update, and analyze student academic records with ease.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-300"
              asChild
            >
              <a href="#features">Learn More</a>
            </Button>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto"
          id="features"
        >
          {[
            {
              icon: "📊",
              title: "Analytics Dashboard",
              description: "Track GPA, top performers, and course statistics in real-time",
            },
            {
              icon: "🎓",
              title: "Transcript Management",
              description: "Create and update student transcripts with comprehensive grade tracking",
            },
            {
              icon: "🔒",
              title: "Secure & Reliable",
              description: "Built with better-auth backend and persistent data storage",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}