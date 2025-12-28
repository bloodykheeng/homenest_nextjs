"use client";
import Link from "next/link";
import { Shield, Users, BookOpen, Eye, Apple, PlayCircle } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";


const Hero = () => {
  return (
    <>
      <section
        id="home"
        className="relative z-10 overflow-hidden bg-linear-to-b from-slate-50 to-white dark:from-gray-dark dark:to-gray-900 pb-8 pt-30 min-h-full"
      >
        <div className="container relative z-10">
          <div className="-mx-4 flex flex-wrap items-center justify-center">
            <div className="w-full px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 lg:w-12/12">
              <div className="mx-auto text-center lg:text-left">
                {/* Badge */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Shield className="h-4 w-4" />
                  <span>Uganda Human Rights Commission</span>
                </div>

                <h1 className="mb-3 text-4xl font-bold leading-tight text-black dark:text-white sm:text-5xl sm:leading-tight md:text-6xl md:leading-tight">
                  Human Rights Integrated Information System
                </h1>

                <p className="mb-5 text-lg leading-relaxed text-body-color dark:text-body-color-dark sm:text-xl">
                  HURIS is an integrated system that consists of three system modules supporting complaint handling, research and education, plus monitoring and inspection in the human rights commission across all regions.
                </p>

                {/* Feature Pills */}
                <div className="mb-5 flex flex-wrap gap-3 justify-center lg:justify-start">
                  <div className="flex items-center gap-2 rounded-full bg-white dark:bg-gray-800 px-4 py-2 shadow-sm">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Complaint Handling</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white dark:bg-gray-800 px-4 py-2 shadow-sm">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Research & Education</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white dark:bg-gray-800 px-4 py-2 shadow-sm">
                    <Eye className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Monitoring & Inspection</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 lg:justify-start mb-5">
                  <Link
                    href="https://uhrc.ug"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-block rounded-lg border-2 border-primary bg-transparent px-8 py-4 text-base font-semibold text-primary duration-300 ease-in-out hover:bg-primary hover:text-white hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Visit UHRC Website
                  </Link>

                  <Link
                    href="#features"
                    className="w-full sm:w-auto inline-block rounded-lg border-2 border-primary bg-transparent px-8 py-4 text-base font-semibold text-primary duration-300 ease-in-out hover:bg-primary hover:text-white hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Learn more
                  </Link>
                </div>

                {/* App Download Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start">
                  <div className="flex gap-3">
                    <Link
                      href="#"
                      className="flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-white duration-300 hover:bg-gray-800"
                    >
                      <Apple className="h-6 w-6" />
                      <div className="text-left">
                        <p className="text-[10px] leading-tight">Download on the</p>
                        <p className="text-sm font-semibold leading-tight">App Store</p>
                      </div>
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-white duration-300 hover:bg-gray-800"
                    >
                      <PlayCircle className="h-6 w-6" />
                      <div className="text-left">
                        <p className="text-[10px] leading-tight">GET IT ON</p>
                        <p className="text-sm font-semibold leading-tight">Google Play</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>




        {/* Right side illustration area */}
        <div className="absolute -bottom-30 right-10 z-[-1] px-4 hidden md:block">
          <div className="relative h-[500px] w-[400px] md:w-[500px]">
            {/* job-hr Lottie Animation */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30 md:opacity-50 lg:opacity-100">
              <DotLottieReact
                src="/dot-lottie-files/human-right.lottie"
                loop
                autoplay
                className="w-full h-full max-w-[600px]"
              />
            </div>
          </div>
        </div>



        {/* Top Right SVG - Reduced size and repositioned */}
        <div className="absolute right-0 top-0 z-[-2] opacity-20 lg:opacity-40">
          <svg
            width="350"
            height="400"
            viewBox="0 0 350 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Main Circle - smaller */}
            <circle
              cx="250"
              cy="80"
              r="120"
              fill="url(#paint0_linear_huris)"
            />

            {/* Shield Shape - smaller */}
            <path
              d="M250 50 L280 65 L280 95 Q280 120 250 135 Q220 120 220 95 L220 65 Z"
              fill="url(#paint1_linear_huris)"
              opacity="0.5"
            />

            {/* Balance circles - smaller */}
            <circle
              cx="280"
              cy="200"
              r="70"
              stroke="url(#paint3_linear_huris)"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
            />

            <circle
              cx="270"
              cy="190"
              r="45"
              fill="url(#paint4_radial_huris)"
              opacity="0.4"
            />

            {/* Small accent circles */}
            <circle cx="320" cy="320" r="20" fill="url(#paint6_radial_huris)" />
            <circle cx="180" cy="60" r="12" fill="url(#paint7_radial_huris)" />

            <defs>
              <linearGradient
                id="paint0_linear_huris"
                x1="130"
                y1="-20"
                x2="250"
                y2="200"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#2563eb" />
                <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
              </linearGradient>

              <linearGradient
                id="paint1_linear_huris"
                x1="220"
                y1="50"
                x2="280"
                y2="135"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#3b82f6" />
                <stop offset="1" stopColor="#1d4ed8" />
              </linearGradient>

              <linearGradient
                id="paint3_linear_huris"
                x1="280"
                y1="130"
                x2="280"
                y2="270"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#2563eb" />
                <stop offset="1" stopColor="#60a5fa" stopOpacity="0" />
              </linearGradient>

              <radialGradient
                id="paint4_radial_huris"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(270 190) rotate(90) scale(45)"
              >
                <stop offset="0.2" stopColor="#3b82f6" stopOpacity="0" />
                <stop offset="1" stopColor="#2563eb" stopOpacity="0.3" />
              </radialGradient>

              <radialGradient
                id="paint6_radial_huris"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(320 320) rotate(90) scale(20)"
              >
                <stop offset="0.3" stopColor="#60a5fa" stopOpacity="0" />
                <stop offset="1" stopColor="#3b82f6" stopOpacity="0.3" />
              </radialGradient>

              <radialGradient
                id="paint7_radial_huris"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(180 60) rotate(90) scale(12)"
              >
                <stop offset="0.3" stopColor="#60a5fa" stopOpacity="0" />
                <stop offset="1" stopColor="#3b82f6" stopOpacity="0.5" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Bottom Center SVG - Reduced and simplified */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[-2] opacity-0 md:opacity-20 lg:opacity-25">
          <svg
            width="350"
            height="250"
            viewBox="0 0 350 250"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Floating rectangles - smaller */}
            <rect
              x="40"
              y="80"
              width="60"
              height="60"
              rx="10"
              fill="url(#paint1_gradient)"
              opacity="0.5"
            />
            <rect
              x="140"
              y="110"
              width="75"
              height="75"
              rx="12"
              fill="url(#paint2_gradient)"
              opacity="0.4"
            />
            <rect
              x="250"
              y="90"
              width="55"
              height="55"
              rx="8"
              fill="url(#paint3_gradient)"
              opacity="0.5"
            />

            {/* Simple circles */}
            <circle
              cx="90"
              cy="200"
              r="18"
              fill="url(#paint6_radial)"
              opacity="0.4"
            />
            <circle
              cx="270"
              cy="190"
              r="22"
              fill="url(#paint7_radial)"
              opacity="0.4"
            />

            {/* Dots pattern - fewer dots */}
            <circle cx="180" cy="60" r="3" fill="#60a5fa" opacity="0.5" />
            <circle cx="205" cy="68" r="2.5" fill="#3b82f6" opacity="0.4" />
            <circle cx="230" cy="63" r="3" fill="#60a5fa" opacity="0.5" />

            <defs>
              <linearGradient
                id="paint1_gradient"
                x1="40"
                y1="80"
                x2="100"
                y2="140"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#60a5fa" />
                <stop offset="1" stopColor="#2563eb" stopOpacity="0.3" />
              </linearGradient>

              <linearGradient
                id="paint2_gradient"
                x1="140"
                y1="110"
                x2="215"
                y2="185"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#3b82f6" />
                <stop offset="1" stopColor="#2563eb" stopOpacity="0.3" />
              </linearGradient>

              <linearGradient
                id="paint3_gradient"
                x1="250"
                y1="90"
                x2="305"
                y2="145"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#60a5fa" />
                <stop offset="1" stopColor="#3b82f6" stopOpacity="0.3" />
              </linearGradient>

              <radialGradient
                id="paint6_radial"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(90 200) scale(18)"
              >
                <stop offset="0.3" stopColor="#60a5fa" />
                <stop offset="1" stopColor="#2563eb" stopOpacity="0.2" />
              </radialGradient>

              <radialGradient
                id="paint7_radial"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(270 190) scale(22)"
              >
                <stop offset="0.3" stopColor="#3b82f6" />
                <stop offset="1" stopColor="#2563eb" stopOpacity="0.2" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Top Left Accent SVG - Smaller */}
        <div className="absolute left-0 top-10 z-[-2] opacity-15 lg:opacity-30">
          <svg
            width="140"
            height="140"
            viewBox="0 0 140 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="70"
              cy="70"
              r="55"
              stroke="url(#paint23_linear_huris)"
              strokeWidth="0.8"
              fill="none"
            />
            <circle
              cx="70"
              cy="70"
              r="35"
              fill="url(#paint24_radial_huris)"
            />
            <defs>
              <linearGradient
                id="paint23_linear_huris"
                x1="70"
                y1="15"
                x2="70"
                y2="125"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#3b82f6" />
                <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
              </linearGradient>
              <radialGradient
                id="paint24_radial_huris"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(70 70) rotate(90) scale(35)"
              >
                <stop offset="0.5" stopColor="#60a5fa" stopOpacity="0" />
                <stop offset="1" stopColor="#3b82f6" stopOpacity="0.15" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Bottom Right Accent Dots - Smaller and fewer */}
        <div className="absolute bottom-8 right-8 z-[-2] opacity-15 lg:opacity-25">
          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="20" cy="20" r="5" fill="#3b82f6" opacity="0.4" />
            <circle cx="50" cy="20" r="5" fill="#3b82f6" opacity="0.4" />
            <circle cx="80" cy="20" r="5" fill="#3b82f6" opacity="0.4" />
            <circle cx="20" cy="50" r="5" fill="#3b82f6" opacity="0.4" />
            <circle cx="50" cy="50" r="5" fill="#3b82f6" opacity="0.4" />
            <circle cx="80" cy="50" r="5" fill="#3b82f6" opacity="0.4" />
            <circle cx="20" cy="80" r="5" fill="#3b82f6" opacity="0.4" />
            <circle cx="50" cy="80" r="5" fill="#3b82f6" opacity="0.4" />
            <circle cx="80" cy="80" r="5" fill="#3b82f6" opacity="0.4" />
          </svg>
        </div>
      </section>
    </>
  );
};

export default Hero;