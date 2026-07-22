import React, { useState, useMemo } from 'react';
import './HomeCalculate.css';

// --- IMPORT YOUR OWN BG & AVATAR IMAGES HERE ---
import bgImage from '../../assets/bugati.webp'; // Replace with your car background image
import avatar1 from '../../assets/author.png';       // Replace with avatar images
import avatar2 from '../../assets/author2.png';
import avatar3 from '../../assets/author3.png';

const HomeCalculate = () => {
  // Input States with Defaults matching reference
  const [price, setPrice] = useState(20000);
  const [interestRate, setInterestRate] = useState(5);
  const [termMonths, setTermMonths] = useState(12);
  const [downPayment, setDownPayment] = useState(12000);

  // Dynamic Car Loan Calculation Logic
  const { amountFinanced, monthlyPayment } = useMemo(() => {
    const financed = Math.max(0, price - downPayment);
    if (financed <= 0) return { amountFinanced: 0, monthlyPayment: 0 };

    const monthlyRate = interestRate / 100 / 12;
    if (monthlyRate === 0) {
      return {
        amountFinanced: financed,
        monthlyPayment: financed / (termMonths || 1)
      };
    }

    const payment =
      (financed * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);

    return {
      amountFinanced: financed,
      monthlyPayment: isNaN(payment) ? 0 : payment
    };
  }, [price, interestRate, termMonths, downPayment]);

  // Helper Formatter
  const formatCurrency = (val) =>
    `$${Number(val).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

  return (
    <section className="calculate-section">
      <div 
        className="calculate-container" 
        style={{ backgroundImage: `linear-gradient(180deg, rgba(12, 15, 18, 0.72) 0%, rgba(12, 15, 18, 0.88) 100%), url(${bgImage})` }}
      >
        <div className="calculate-content-wrapper">
          
          {/* LEFT SIDE: Heading & Description */}
          <div className="calculate-left">
            <h2 className="calc-heading">
              Want to Calculate Your<br />Car Payment?
            </h2>
            <p className="calc-subtext">
              Match with up to 4 lenders to get the lowest rate<br />
              available with no markups, no fees, and no obligations.
            </p>
          </div>

          {/* RIGHT SIDE: Loan Calculator Card */}
          <div className="calculate-card">
            <h3 className="card-title">Car Loan Calculator</h3>
            <p className="card-subtitle">
              Estimate your monthly auto loan payments with this calculator.
            </p>

            {/* Form Inputs Grid */}
            <div className="calc-form-grid">
              {/* Input 1: Price of vehicle */}
              <div className="input-group">
                <label className="input-label">Price of vehicle</label>
                <div className="input-field-wrapper">
                  <span className="unit-prefix">$</span>
                  <input
                    type="number"
                    className="calc-input"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="20,000"
                  />
                </div>
              </div>

              {/* Input 2: Interest rate */}
              <div className="input-group">
                <label className="input-label">Interest rate</label>
                <div className="input-field-wrapper">
                  <input
                    type="number"
                    className="calc-input"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    placeholder="5"
                  />
                  <span className="unit-suffix">%</span>
                </div>
              </div>

              {/* Input 3: Terms */}
              <div className="input-group">
                <label className="input-label">Terms</label>
                <div className="input-field-wrapper">
                  <input
                    type="number"
                    className="calc-input"
                    value={termMonths}
                    onChange={(e) => setTermMonths(Number(e.target.value))}
                    placeholder="12"
                  />
                  <span className="unit-suffix">months</span>
                </div>
              </div>

              {/* Input 4: Down payment */}
              <div className="input-group">
                <label className="input-label">Down payment</label>
                <div className="input-field-wrapper">
                  <span className="unit-prefix">$</span>
                  <input
                    type="number"
                    className="calc-input"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    placeholder="12,000"
                  />
                </div>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="calc-summary-list">
              <div className="summary-row">
                <span className="summary-label">Down payment ammout</span>
                <span className="summary-value">${downPayment.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Amount financed</span>
                <span className="summary-value">{formatCurrency(amountFinanced)}</span>
              </div>
              <div className="summary-row highlight-row">
                <span className="summary-label">Monthly payment</span>
                <span className="summary-value green-text">{formatCurrency(monthlyPayment)}</span>
              </div>
            </div>

            {/* Action Button */}
            <button className="apply-loan-btn">
              <span>Apply for a loan</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>

        {/* HORIZONTAL DIVIDER */}
        <hr className="calc-divider" />

        {/* BOTTOM SECTION: Stats & Social Proof Floating Badge */}
        <div className="calc-bottom-wrapper">
          {/* Key Statistics */}
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">45+</span>
              <span className="stat-label">Global<br />Branches</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">29K</span>
              <span className="stat-label">Destinations<br />Collaboration</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">20+</span>
              <span className="stat-label">Years<br />Experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">168K</span>
              <span className="stat-label">Happy<br />Customers</span>
            </div>
          </div>

          {/* Floating Social Proof Badge */}
          <div className="social-proof-badge">
            <div className="avatar-group">
              <img src={avatar1} alt="User 1" className="avatar-img" />
              <img src={avatar2} alt="User 2" className="avatar-img" />
              <img src={avatar3} alt="User 3" className="avatar-img" />
              <div className="avatar-plus-btn">+</div>
            </div>
            <p className="badge-text">
              <strong>1684 people</strong> used <strong>Carento</strong> in the last <strong>24 hours</strong>
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HomeCalculate;