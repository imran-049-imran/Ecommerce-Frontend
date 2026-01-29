import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <>
      {/* PAGE HEADER */}
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Have a question about orders, products or support? We’re here to help.</p>
      </div>

      <section className="contact-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">

              <div className="contact-card">

                <h4 className="form-title">Send us a message</h4>

                <form>
                  <div className="row g-3">

                    <div className="col-md-6">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-control ecommerce-input"
                        placeholder="Enter first name"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-control ecommerce-input"
                        placeholder="Enter last name"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control ecommerce-input"
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Message</label>
                      <textarea
                        rows="5"
                        className="form-control ecommerce-input"
                        placeholder="Write your message..."
                        required
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn contact-btn">
                        Submit Request
                      </button>
                    </div>

                  </div>
                </form>

              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
