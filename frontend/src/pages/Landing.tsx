import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingDown, Shield, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { BRAZILIAN_STATES } from "@/constants/brazilianStates";
import { searchCepByAddress } from "@/services/viaCepService";

const Landing = () => {
  const [originState, setOriginState] = useState("");
  const [originCity, setOriginCity] = useState("");
  const [originStreet, setOriginStreet] = useState("");
  const [originCep, setOriginCep] = useState<string | null>(null);
  const [destinationState, setDestinationState] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [destinationStreet, setDestinationStreet] = useState("");
  const [destinationCep, setDestinationCep] = useState<string | null>(null);
  const [weight, setWeight] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [depth, setDepth] = useState("");

  useEffect(() => {
    const fetchOriginCep = async () => {
      if (originState && originCity && originStreet) {
        const cep = await searchCepByAddress(originState, originCity, originStreet);
        setOriginCep(cep);
      } else {
        setOriginCep(null);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchOriginCep();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [originState, originCity, originStreet]);

  useEffect(() => {
    const fetchDestinationCep = async () => {
      if (destinationState && destinationCity && destinationStreet) {
        const cep = await searchCepByAddress(destinationState, destinationCity, destinationStreet);
        setDestinationCep(cep);
      } else {
        setDestinationCep(null);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchDestinationCep();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [destinationState, destinationCity, destinationStreet]);

  const calculateFreight = () => {
    if (!originState || !originCity || !originStreet || !destinationState || !destinationCity || !destinationStreet || !weight || !width || !height || !depth) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields to calculate freight",
        variant: "destructive",
      });
      return;
    }

    if (!originCep || !destinationCep) {
      toast({
        title: "CEP Not Found",
        description: "Please ensure the address information is correct to find the CEP",
        variant: "destructive",
      });
      return;
    }

    const mockPrice = (parseFloat(weight) * 0.5 + Math.random() * 50).toFixed(2);
    const originDisplay = `${originState} - ${originCity}`;
    const destinationDisplay = `${destinationState} - ${destinationCity}`;
    toast({
      title: "Freight Estimated",
      description: `From ${originDisplay} to ${destinationDisplay}: $${mockPrice}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in">
          <h2 className="text-5xl font-bold mb-6 text-foreground">
            Smart Freight Auditing
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Reduce shipping costs with AI-powered freight audit and analysis
          </p>
        </div>

        {/* Freight Calculator */}
        <Card className="max-w-2xl mx-auto p-8 shadow-lg animate-scale-in">
          <h3 className="text-2xl font-semibold mb-6 text-center">Calculate Freight Cost</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Origin</label>
              <div className="grid grid-cols-12 gap-4 mb-4">
                <div className="col-span-3">
                  <Select value={originState} onValueChange={setOriginState}>
                    <SelectTrigger>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRAZILIAN_STATES.map((state) => (
                        <SelectItem key={state.code} value={state.code}>
                          {state.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-9">
                  <Input
                    placeholder="Enter origin city"
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-2">
                <Input
                  placeholder="Enter street name"
                  value={originStreet}
                  onChange={(e) => setOriginStreet(e.target.value)}
                />
              </div>
              {originCep && (
                <p className="text-xs text-green-600 mt-1">
                  CEP found: {originCep}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Destination</label>
              <div className="grid grid-cols-12 gap-4 mb-4">
                <div className="col-span-3">
                  <Select value={destinationState} onValueChange={setDestinationState}>
                    <SelectTrigger>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRAZILIAN_STATES.map((state) => (
                        <SelectItem key={state.code} value={state.code}>
                          {state.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-9">
                  <Input
                    placeholder="Enter destination city"
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-2">
                <Input
                  placeholder="Enter street name"
                  value={destinationStreet}
                  onChange={(e) => setDestinationStreet(e.target.value)}
                />
              </div>
              {destinationCep && (
                <p className="text-xs text-green-600 mt-1">
                  CEP found: {destinationCep}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Weight (kg)</label>
              <Input
                type="number"
                placeholder="Enter package weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Width (cm)</label>
                <Input
                  type="number"
                  placeholder="Enter width"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Height (cm)</label>
                <Input
                  type="number"
                  placeholder="Enter height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Depth (cm)</label>
                <Input
                  type="number"
                  placeholder="Enter depth"
                  value={depth}
                  onChange={(e) => setDepth(e.target.value)}
                />
              </div>
            </div>
            <Button className="w-full" size="lg" onClick={calculateFreight}>
              Calculate Freight
            </Button>
          </div>
        </Card>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 hover-scale">
            <TrendingDown className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Cost Reduction</h3>
            <p className="text-muted-foreground">
              Identify overcharges and reduce freight costs by up to 20%
            </p>
          </Card>
          <Card className="p-6 hover-scale">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Accurate Auditing</h3>
            <p className="text-muted-foreground">
              Advanced algorithms ensure precise freight charge validation
            </p>
          </Card>
          <Card className="p-6 hover-scale">
            <BarChart3 className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
            <p className="text-muted-foreground">
              Real-time insights into shipping patterns and cost optimization
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Landing;
