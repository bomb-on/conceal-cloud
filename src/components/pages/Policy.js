import React from 'react';
import { Link } from 'react-router-dom';


const Privacy = () => (
  <div>
    <div className="slim-mainpanel">
      <div className="container">

        <div className="slim-pageheader">
          <ol className="breadcrumb slim-breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Privacy Policy</li>
          </ol>
          <h6 className="slim-pagetitle">Privacy Policy</h6>
        </div>

        <div className="section-wrapper mg-t-20">
          <label className="section-title">Privacy Policy</label>
          <div className="row">
            <div className="col-lg-12">
              <h4>What We Collect</h4>
              <p>
                We collect standard server logs from our webserver. All data processed is anonymized. Like many site
                operators, we collect information that your browser sends whenever you visit our site ("Log Data").
                This Log Data may include information such as your computer's Internet Protocol ("IP") address (with
                replaced last byte), browser type, browser version, the pages of our site that you visit, the time and
                date of your visit, the time spent on those pages and other statistics
              </p>
              <h4>What We Use the Data For</h4>
              <p>
                Server log data is used to provide statistics on the website and help us to improve the content and the
                information flow. This data is also used to analyze errors and diagnose requests to dead links.
              </p>
              <h4>Changes of Privacy Policy</h4>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the
                new privacy policy on the Site. You are advised to review this privacy policy periodically for any changes.
              </p>
              <h4>Contact</h4>
              <p>
                If you have any questions about our privacy policy, or how your data is being collected and processed,
                please e-mail us at: <a href="mailto:privacy@conceal.network">privacy@conceal.network</a>.
              </p>
              <h4>Latest Updatet</h4>
              <p>
                This Privacy Policy was last updated: 18th October, 2021.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
);

export default Privacy;
