import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, MapPin, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data
const mockPackages = [
  {
    id: "PKG-001",
    orderId: "ORD-2024-001",
    customerCity: "New York",
    customerState: "NY",
    sellerCity: "Los Angeles",
    sellerState: "CA",
    productWeight: 5.2,
    freightValue: 45.50,
    status: "delivered",
    orderDate: "2024-01-15",
  },
  {
    id: "PKG-002",
    orderId: "ORD-2024-002",
    customerCity: "Chicago",
    customerState: "IL",
    sellerCity: "Houston",
    sellerState: "TX",
    productWeight: 12.8,
    freightValue: 78.20,
    status: "in_transit",
    orderDate: "2024-01-16",
  },
  {
    id: "PKG-003",
    orderId: "ORD-2024-003",
    customerCity: "Miami",
    customerState: "FL",
    sellerCity: "Seattle",
    sellerState: "WA",
    productWeight: 3.5,
    freightValue: 62.00,
    status: "pending",
    orderDate: "2024-01-17",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [packages] = useState(mockPackages);

  const filteredPackages = packages.filter(pkg =>
    pkg.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.customerCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.sellerCity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
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
                <p className="text-3xl font-bold">{packages.filter(p => p.status === "in_transit").length}</p>
              </div>
              <MapPin className="h-12 w-12 text-blue-500 opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-3xl font-bold">{packages.filter(p => p.status === "delivered").length}</p>
              </div>
              <Package className="h-12 w-12 text-green-500 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Packages Table */}
        <Card>
          <div className="overflow-x-auto">
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
                    <td className="p-4 font-medium">{pkg.orderId}</td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div>{pkg.sellerCity}, {pkg.sellerState}</div>
                        <div className="text-muted-foreground">→ {pkg.customerCity}, {pkg.customerState}</div>
                      </div>
                    </td>
                    <td className="p-4">{pkg.productWeight}</td>
                    <td className="p-4 font-medium">${pkg.freightValue.toFixed(2)}</td>
                    <td className="p-4">
                      <Badge className={getStatusColor(pkg.status)}>
                        {pkg.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{pkg.orderDate}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/package/${pkg.id}`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
