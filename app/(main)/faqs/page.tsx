import Head from 'next/head';
import FaqsListing from "./FaqsListing";

const FaqsPage = () => {
    return (
        <>
            <Head>
                <title>FAQs - Contract Monitoring System</title>
                <meta
                    name="description"
                    content="Learn more about the Contract Monitoring System (CMS), its purpose, features, and how it enhances transparency in government projects."
                />
            </Head>
            <FaqsListing />
        </>
    );
};

export default FaqsPage;
