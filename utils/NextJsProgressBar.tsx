"use client";
import React from "react";
// import NextNProgress from 'nextjs-progressbar';
import NextTopLoader from "nextjs-toploader";

function NextJsProgressBar() {
  return (
    <>
      {/* <NextNProgress /> */}
      <NextTopLoader showSpinner={false} />
    </>
  );
}

export default NextJsProgressBar;
