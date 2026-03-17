# Prop Firm Monte Carlo Simulator

A professional-grade web application for futures traders to simulate their trading strategy\'s probability of passing proprietary trading firm evaluation programs using Monte Carlo simulation.

## 🚀 Features

- **Monte Carlo Simulation Engine**: Run thousands of random trading paths to estimate pass rates, blow rates, and expected payouts
- **Comprehensive Firm Database**: Pre-configured with major prop firms (Apex, TopStep, Lucid Trading, MFF, etc.) and their exact rules
- **Professional Trading Analytics**: Kelly Criterion, Expected Value, Risk-Reward ratios, and breakeven analysis  
- **Interactive Visualizations**: Equity curve fan charts, distribution analysis, and risk metrics
- **Strategy Parameter Testing**: Win rate, average win/loss, trade frequency, variance, and advanced risk management
- **Real-time Updates**: Instant recalculation of derived statistics as you adjust parameters

## 🎯 Target Users

- **Futures Traders** evaluating prop firm challenges
- **Quantitative Analysts** modeling trading strategies  
- **Risk Managers** assessing downside scenarios
- **Trading Educators** teaching probability and risk management

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom trading theme
- **Charts**: Recharts for professional financial visualizations
- **State Management**: Zustand with persistence
- **Deployment**: Optimized for Vercel

## 🏗 Architecture

```
/
├── app/                    # Next.js App Router pages
│   ├── simulator/         # Main Monte Carlo simulator
│   ├── ev-explorer/       # Expected Value analysis tools
│   ├── compare/           # Side-by-side firm comparison  
│   ├── my-numbers/        # Personal trading statistics
│   ├── variance/          # Win/loss variance impact analysis
│   └── firm-picker/       # AI-powered firm recommendations
├── components/            # Reusable UI components
│   ├── Layout.tsx         # Main application layout
│   ├── FirmSelector.tsx   # Prop firm selection interface
│   ├── StrategyInputs.tsx # Trading parameter controls
│   ├── SimulationResults.tsx # Results display
│   ├── EquityCurveChart.tsx # Financial visualizations
│   └── MetricCard.tsx     # Standardized metric display
├── lib/                   # Core business logic
│   ├── simulation.ts      # Monte Carlo engine
│   ├── firms.ts          # Prop firm configurations
│   ├── analytics.ts      # Trading calculations
│   ├── store.ts          # Global state management
│   └── utils.ts          # Helper functions
└── types/                # TypeScript definitions
    ├── firm.ts           # Prop firm data structures
    ├── simulation.ts     # Monte Carlo types
    └── params.ts         # Application state types
```

## 🔬 Simulation Algorithm

The Monte Carlo engine simulates individual trading paths:

1. **Initialize**: Starting balance, drawdown floor, profit target
2. **Generate Trades**: Random win/loss based on win rate and R:R ratio
3. **Apply Costs**: Commission, slippage, and variance
4. **Update State**: Running equity, daily P&L, drawdown tracking
5. **Check Rules**: Profit target hit, drawdown floor breach, daily loss limits
6. **Aggregate Results**: Statistics across thousands of paths

### Key Calculations

- **Expected Value per Trade**: `(WR × AvgWin - (1-WR) × AvgLoss) × $20 - Commission - Slippage`
- **Kelly Criterion**: `WR - (1-WR) / RiskRewardRatio`
- **Breakeven Win Rate**: `AvgLoss / (AvgWin + AvgLoss)`
- **Recovery Factor**: `NetProfit / MaxDrawdown`

## 📊 Supported Prop Firms

### Currently Implemented
- **Apex Trader Funding** (EOD & Intraday trailing)
- **TopstepTrader** (with 2026 rule changes)
- **Lucid Trading** (Pro, Flex, Direct plans)
- **MyFundedFutures** (Core, Rapid, Pro)
- **AquaFutures** (Standard, Beginner, Instant Pro)
- **Tradeify Growth**
- **Bulenox**
- **TakeProfitTrader**
- **QT Futures** (Pro & Core Instant)

### Firm-Specific Features
- Trailing drawdown types (EOD vs intraday)
- Payout ladders and consistency rules
- Daily loss limits and scaling tiers
- Monthly fees and activation costs
- Withdrawal impact mechanics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/prop-firm-monte-carlo.git
   cd prop-firm-monte-carlo
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 🎮 Usage Guide

### Basic Workflow

1. **Select Firm & Account**: Choose from dropdown of configured prop firms
2. **Configure Strategy**: Set win rate, average win/loss, trades per day
3. **Advanced Options**: Add variance, risk management, trade management rules
4. **Run Simulation**: Execute Monte Carlo with 2,000 paths
5. **Analyze Results**: Review pass rates, expected payouts, risk metrics

### Key Metrics to Watch

- **Pass Rate**: % of paths hitting profit target (target: >60%)
- **Expected Payout**: Average $ per evaluation attempt
- **Monthly Net Income**: Projected monthly earnings after fees
- **Recovery Factor**: Profit-to-drawdown ratio (target: >2.0)
- **P95 Max Drawdown**: Worst-case scenario planning

### Strategy Optimization Tips

- **Start Conservative**: Begin with proven win rates and R:R ratios
- **Test Variance Impact**: See how win/loss size variation affects outcomes
- **Compare Firms**: Different rules favor different trading styles
- **Factor All Costs**: Include commissions, slippage, subscription fees
- **Plan for Retries**: Most traders need 2-3 attempts to pass

## 🔧 Configuration

### Adding New Prop Firms

Extend the `PROP_FIRMS` array in `lib/firms.ts`:

```typescript
{
  id: "your_firm_id",
  name: "Your Firm Name", 
  plans: [{
    id: "plan_id",
    name: "Plan Name",
    drawdown_type: "eod_trailing", // or "trailing_threshold"
    payout_split: 0.80, // 80%
    account_sizes: [{
      size: 50000,
      profit_target: 3000,
      trailing_drawdown: 2000,
      daily_loss_limit: 1000,
      max_contracts: 5,
      eval_fee: 150
    }]
  }]
}
```

### Customizing Simulation Parameters

Modify `simulationSettings` in the simulator page:

```typescript
const simulationSettings = {
  n_paths: 5000,           // More paths = higher accuracy
  n_trades_per_path: 1000, // Max trades before timeout
  live_trailing_drawdown: true // Model intraday peaks
};
```

## 📈 Performance Optimization

- **Web Workers**: Large simulations run without blocking UI
- **Canvas Rendering**: Smooth chart performance with thousands of data points  
- **State Persistence**: Settings saved locally between sessions
- **Lazy Loading**: Components load on-demand
- **Bundle Optimization**: Tree-shaking and code splitting

## 🧪 Testing Strategy

### Manual Testing Checklist
- [ ] All prop firms load correctly
- [ ] Sliders update derived statistics  
- [ ] Monte Carlo completes without errors
- [ ] Charts render with realistic data
- [ ] Mobile responsive design
- [ ] State persistence across refreshes

### Validation Methods
- **Known Scenarios**: Test extreme win rates (10%, 90%)
- **Edge Cases**: Zero variance, maximum contracts
- **Benchmark Results**: Compare to analytical solutions where possible
- **Performance**: 2,000-path simulation completes <5 seconds

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Import project from GitHub
   - Vercel auto-detects Next.js configuration

2. **Configure Build**
   - Build Command: `npm run build`
   - Output Directory: `.next` (automatic)
   - Node.js Version: 18.x

3. **Environment Variables**
   - Add production environment variables
   - Set `NODE_ENV=production`

4. **Deploy**
   - Automatic deployments on git push
   - Preview deployments for pull requests

### Other Platforms

The application can deploy to any platform supporting Node.js:
- **Netlify**: Static export with API routes
- **AWS Amplify**: Full-stack deployment  
- **Railway**: Container-based hosting
- **Self-hosted**: Docker or direct Node.js

## 🔮 Future Roadmap

### Phase 2 Features
- [ ] **Multi-timeframe Analysis**: Different holding periods
- [ ] **Strategy Backtesting**: Historical market data integration
- [ ] **Portfolio Optimization**: Multiple prop firm accounts  
- [ ] **Risk Budgeting**: Kelly sizing across accounts

### Phase 3 Features  
- [ ] **Machine Learning**: Pattern recognition in path outcomes
- [ ] **Social Features**: Strategy sharing and leaderboards
- [ ] **API Integration**: Live broker data feeds
- [ ] **Mobile App**: Native iOS/Android versions

### Advanced Analytics
- [ ] **Correlation Analysis**: Market regime impacts
- [ ] **Sensitivity Analysis**: Parameter robustness testing
- [ ] **Scenario Modeling**: Economic event simulations
- [ ] **Real-time Monitoring**: Live account integration

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`) 
5. Open Pull Request

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Enforced code formatting
- **Testing**: Unit tests for core calculations
- **Documentation**: JSDoc comments for public APIs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/prop-firm-monte-carlo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/prop-firm-monte-carlo/discussions)
- **Email**: support@yourapp.com

## ⚠️ Disclaimer

This software is for educational and analytical purposes only. Past performance does not guarantee future results. Trading futures involves substantial risk of loss. Always consult with qualified professionals before making trading decisions.

## 🙏 Acknowledgments

- Prop trading community for requirements and feedback
- Open source contributors and maintainers
- Financial mathematics and risk management research
- Next.js and React ecosystem
