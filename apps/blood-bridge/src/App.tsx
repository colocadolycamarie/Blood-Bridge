import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AuthProvider } from './components/auth/AuthContext';
import { RequestsProvider } from './lib/store/requests-store';
import { DonationsProvider } from './lib/store/donations-store';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import PublicRequests from './pages/PublicRequests';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Overview from './pages/dashboard/Overview';
import Profile from './pages/dashboard/Profile';
import Requests from './pages/dashboard/Requests';
import Inventory from './pages/dashboard/Inventory';
import Donations from './pages/dashboard/Donations';
import NotFound from './pages/NotFound';
import BloodTypes from './pages/BloodTypes';
import FAQ from './pages/FAQ';
import Pricing from './pages/Pricing';
import Impact from './pages/Impact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/contact" component={Contact} />
      <Route path="/requests" component={PublicRequests} />
      <Route path="/blood-types" component={BloodTypes} />
      <Route path="/faq" component={FAQ} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/impact" component={Impact} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />

      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      <Route path="/dashboard" component={Overview} />
      <Route path="/dashboard/profile" component={Profile} />
      <Route path="/dashboard/requests" component={Requests} />
      <Route path="/dashboard/inventory" component={Inventory} />
      <Route path="/dashboard/donations" component={Donations} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <RequestsProvider>
        <DonationsProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </DonationsProvider>
      </RequestsProvider>
    </AuthProvider>
  );
}

export default App;
