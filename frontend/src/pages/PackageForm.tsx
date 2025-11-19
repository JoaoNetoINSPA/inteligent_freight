import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { packageService } from "@/services/packageService";

const PackageForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = id !== "new" && id !== undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(isEdit);

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

  useEffect(() => {
    if (isEdit && id) {
      loadPackage(parseInt(id));
    }
  }, [isEdit, id]);

  const loadPackage = async (packageId: number) => {
    try {
      setIsLoadingData(true);
      const pkg = await packageService.getById(packageId);
      setFormData({
        orderId: pkg.order_id || "",
        customerCity: pkg.customer_city || "",
        customerState: pkg.customer_state || "",
        customerZipCode: pkg.customer_zip_code_prefix?.toString() || "",
        sellerCity: pkg.seller_city || "",
        sellerState: pkg.seller_state || "",
        sellerZipCode: pkg.seller_zip_code_prefix?.toString() || "",
        productWeight: pkg.product_weight_g ? (pkg.product_weight_g / 1000).toString() : "",
        productLength: pkg.product_length_cm?.toString() || "",
        productHeight: pkg.product_height_cm?.toString() || "",
        productWidth: pkg.product_width_cm?.toString() || "",
        freightValue: pkg.freight_value?.toString() || "",
        paymentType: pkg.payment_type || "",
        orderStatus: pkg.order_status || "pending",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load package",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.orderId || !formData.customerCity || !formData.sellerCity) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const packageData = {
        order_id: formData.orderId,
        customer_city: formData.customerCity,
        customer_state: formData.customerState || undefined,
        customer_zip_code_prefix: formData.customerZipCode ? parseInt(formData.customerZipCode) : undefined,
        seller_city: formData.sellerCity,
        seller_state: formData.sellerState || undefined,
        seller_zip_code_prefix: formData.sellerZipCode ? parseInt(formData.sellerZipCode) : undefined,
        product_weight_g: formData.productWeight ? parseFloat(formData.productWeight) * 1000 : undefined,
        product_length_cm: formData.productLength ? parseFloat(formData.productLength) : undefined,
        product_height_cm: formData.productHeight ? parseFloat(formData.productHeight) : undefined,
        product_width_cm: formData.productWidth ? parseFloat(formData.productWidth) : undefined,
        freight_value: formData.freightValue ? parseFloat(formData.freightValue) : undefined,
        payment_type: formData.paymentType || undefined,
        order_status: formData.orderStatus,
      };

      if (isEdit && id) {
        await packageService.update(parseInt(id), packageData);
        toast({
          title: "Package Updated",
          description: `Package ${formData.orderId} has been updated successfully`,
        });
      } else {
        await packageService.create(packageData);
        toast({
          title: "Package Created",
          description: `Package ${formData.orderId} has been created successfully`,
        });
      }

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: isEdit ? "Update Failed" : "Creation Failed",
        description: error instanceof Error ? error.message : `Failed to ${isEdit ? "update" : "create"} package`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoadingData) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <div className="text-center p-8 text-muted-foreground">Loading package data...</div>
        </div>
      </DashboardLayout>
    );
  }

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
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Package" : "Create Package")}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard")} disabled={isLoading}>
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
