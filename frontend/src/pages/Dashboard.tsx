import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, MapPin, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { packageService, Package as PackageType } from "@/services/packageService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setIsLoading(true);
      const data = await packageService.getAll();
      setPackages(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load packages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this package?")) {
      return;
    }

    try {
      await packageService.delete(id);
      toast({
        title: "Package Deleted",
        description: "Package has been deleted successfully",
      });
      loadPackages();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete package",
        variant: "destructive",
      });
    }
  };

  const filteredPackages = packages.filter(pkg => {
    const search = searchTerm.toLowerCase();
    return (
      pkg.order_id?.toLowerCase().includes(search) ||
      pkg.customer_city?.toLowerCase().includes(search) ||
      pkg.seller_city?.toLowerCase().includes(search)
    );
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500";
      case "in_transit":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getWeightInKg = (weightG?: number | string) => {
    if (!weightG) return "N/A";
    const weight = typeof weightG === 'string' ? parseFloat(weightG) : weightG;
    if (isNaN(weight)) return "N/A";
    return (weight / 1000).toFixed(2);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Package Management</h2>
            <p className="text-muted-foreground mt-1">Manage and track all your packages</p>
          </div>
          <Button onClick={() => navigate("/package/new")} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Package
          </Button>
        </div>

        {/* Search */}
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID, customer city, or seller city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Packages</p>
                <p className="text-3xl font-bold">{packages.length}</p>
              </div>
              <Package className="h-12 w-12 text-primary opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Transit</p>
                <p className="text-3xl font-bold">{packages.filter(p => p.order_status === "in_transit").length}</p>
              </div>
              <MapPin className="h-12 w-12 text-blue-500 opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-3xl font-bold">{packages.filter(p => p.order_status === "delivered").length}</p>
              </div>
              <Package className="h-12 w-12 text-green-500 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Packages Table */}
        <Card>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading packages...</div>
            ) : filteredPackages.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {searchTerm ? "No packages found matching your search" : "No packages yet. Create your first package!"}
              </div>
            ) : (
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Order ID</th>
                    <th className="text-left p-4 font-semibold">Route</th>
                    <th className="text-left p-4 font-semibold">Weight (kg)</th>
                    <th className="text-left p-4 font-semibold">Freight Value</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Date</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPackages.map((pkg) => (
                    <tr key={pkg.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-4 font-medium">{pkg.order_id || "N/A"}</td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div>{pkg.seller_city || "N/A"}, {pkg.seller_state || ""}</div>
                          <div className="text-muted-foreground">→ {pkg.customer_city || "N/A"}, {pkg.customer_state || ""}</div>
                        </div>
                      </td>
                      <td className="p-4">{getWeightInKg(pkg.product_weight_g)}</td>
                      <td className="p-4 font-medium">${pkg.freight_value ? Number(pkg.freight_value).toFixed(2) : "0.00"}</td>
                      <td className="p-4">
                        <Badge className={getStatusColor(pkg.order_status)}>
                          {pkg.order_status ? pkg.order_status.replace("_", " ") : "pending"}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {formatDate(pkg.order_purchase_timestamp || pkg.created_at)}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/package/${pkg.id}`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(pkg.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
