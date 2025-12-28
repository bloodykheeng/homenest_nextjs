"use client";

import React, { useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import RecordsList from "./RecordsList";

import StatCards from './StatCards'

const QueueTabsPage: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="p-4">
            {/* <h2 className="text-xl font-bold mb-4">Queues Dashboard</h2> */}

            <StatCards />

            <TabView
                activeIndex={activeIndex}
                onTabChange={(e) => setActiveIndex(e.index)}
            >
                <TabPanel header="Jobs">
                    <RecordsList queueType="jobs" />
                </TabPanel>

                <TabPanel header="Failed Jobs">
                    <RecordsList queueType="failed" />
                </TabPanel>
            </TabView>
        </div>
    );
};

export default QueueTabsPage;
