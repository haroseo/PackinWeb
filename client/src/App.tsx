import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LibraryProvider } from "@/contexts/LibraryContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Layout from "@/components/webzip/Layout";
import Home from "@/pages/Home";
import FeatureDetail from "@/pages/FeatureDetail";
import Compare from "@/pages/Compare";
import Checklist from "@/pages/Checklist";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <LibraryProvider>
            <Toaster />
            <Layout>
              <Switch>
                <Route path="/">{() => <Home />}</Route>
                <Route path="/saved">{() => <Home savedOnly />}</Route>
                <Route path="/features/:id">
                  {params => <FeatureDetail id={params.id} />}
                </Route>
                <Route path="/compare" component={Compare} />
                <Route path="/checklist" component={Checklist} />
                <Route path="/about" component={About} />
                <Route component={NotFound} />
              </Switch>
            </Layout>
          </LibraryProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
