import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const PackageForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = id !== "new";

  const [formData, setFormData] = useState({
    orderId: "",
    customerCity: "",
    customerState: "",
    customerZipCode: "",
    sellerCity: "",
    sellerState: "",
    sellerZipCode: "",
    productWeight: "",
    productLength: "",
    productHeight: "",
    productWidth: "",
    freightValue: "",
    paymentType: "",
    orderStatus: "pending",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.orderId || !formData.customerCity || !formData.sellerCity) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: isEdit ? "Package Updated" : "Package Created",
      description: `Package ${formData.orderId} has been ${isEdit ? "updated" : "created"} successfully`,
    });

    navigate("/dashboard");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold">{isEdit ? "Edit Package" : "New Package"}</h2>
            <p className="text-muted-foreground">Enter package details below</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="p-6 space-y-6">
            {/* Order Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Order Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Order ID *</label>
                  <Input
                    placeholder="ORD-2024-001"
                    value={formData.orderId}
                    onChange={(e) => handleChange("orderId", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Order Status</label>
                  <Select value={formData.orderStatus} onValueChange={(value) => handleChange("orderStatus", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Location</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">City *</label>
                  <Input
                    placeholder="New York"
                    value={formData.customerCity}
                    onChange={(e) => handleChange("customerCity", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">State *</label>
                  <Input
                    placeholder="NY"
                    value={formData.customerState}
                    onChange={(e) => handleChange("customerState", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">ZIP Code</label>
                  <Input
                    placeholder="10001"
                    value={formData.customerZipCode}
                    onChange={(e) => handleChange("customerZipCode", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Seller Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Seller Location</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">City *</label>
                  <Input
                    placeholder="Los Angeles"
                    value={formData.sellerCity}
                    onChange={(e) => handleChange("sellerCity", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">State *</label>
                  <Input
                    placeholder="CA"
                    value={formData.sellerState}
                    onChange={(e) => handleChange("sellerState", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">ZIP Code</label>
                  <Input
                    placeholder="90001"
                    value={formData.sellerZipCode}
                    onChange={(e) => handleChange("sellerZipCode", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Product Details</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Weight (kg)</label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="5.2"
                    value={formData.productWeight}
                    onChange={(e) => handleChange("productWeight", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Length (cm)</label>
                  <Input
                    type="number"
                    placeholder="30"
                    value={formData.productLength}
                    onChange={(e) => handleChange("productLength", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Height (cm)</label>
                  <Input
                    type="number"
                    placeholder="20"
                    value={formData.productHeight}
                    onChange={(e) => handleChange("productHeight", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Width (cm)</label>
                  <Input
                    type="number"
                    placeholder="15"
                    value={formData.productWidth}
                    onChange={(e) => handleChange("productWidth", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Freight Value ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="45.50"
                    value={formData.freightValue}
                    onChange={(e) => handleChange("freightValue", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Payment Type</label>
                  <Select value={formData.paymentType} onValueChange={(value) => handleChange("paymentType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="debit_card">Debit Card</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {isEdit ? "Update Package" : "Create Package"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
                Cancel
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default PackageForm;
