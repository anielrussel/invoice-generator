"use client";

import React, { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Download, Save, Edit, Eye } from "lucide-react";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  from: {
    name: string;
    address: string;
    city: string;
    email: string;
    phone: string;
  };
  to: {
    name: string;
    address: string;
    city: string;
    email: string;
    phone: string;
  };
  items: InvoiceItem[];
  notes: string;
  subtotal: number;
  tax: number;
  total: number;
}

const InvoiceGenerator: React.FC = () => {
  const [isPreview, setIsPreview] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: "INV-001",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    from: {
      name: "Your Company Name",
      address: "123 Business Street",
      city: "Business City, BC 12345",
      email: "hello@yourcompany.com",
      phone: "+1 (555) 123-4567",
    },
    to: {
      name: "",
      address: "",
      city: "",
      email: "",
      phone: "",
    },
    items: [
      {
        id: "1",
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ],
    notes: "Thank you for your business!",
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  const updateFromField = (field: keyof InvoiceData["from"], value: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      from: { ...prev.from, [field]: value },
    }));
  };

  const updateToField = (field: keyof InvoiceData["to"], value: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      to: { ...prev.to, [field]: value },
    }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setInvoiceData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const removeItem = (id: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "quantity" || field === "rate") {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      }),
    }));
  };

  // Calculate totals
  React.useEffect(() => {
    const subtotal = invoiceData.items.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    setInvoiceData((prev) => ({
      ...prev,
      subtotal,
      tax,
      total,
    }));
  }, [invoiceData.items]);

  const handleSave = () => {
    const jsonData = JSON.stringify(invoiceData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${invoiceData.invoiceNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGeneratePDF = () => {
    // This would integrate with react-pdf renderer
    alert(
      "PDF generation would be implemented with react-pdf renderer library"
    );
  };

  const EditableField = ({
    value,
    onChange,
    className = "",
    multiline = false,
    ...props
  }: {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    multiline?: boolean;
    placeholder?: string;
  }) => {
    if (isPreview) {
      return (
        <div className={`border-transparent bg-transparent p-2 ${className}`}>
          {multiline ? (
            <div className="whitespace-pre-wrap">
              {value || "Not specified"}
            </div>
          ) : (
            <span>{value || "Not specified"}</span>
          )}
        </div>
      );
    }

    return multiline ? (
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
        {...props}
      />
    ) : (
      <Input
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        className={className}
        {...props}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Invoice Generator
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center gap-2"
            >
              {isPreview ? (
                <Edit className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {isPreview ? "Edit" : "Preview"}
            </Button>
            <Button
              variant="outline"
              onClick={handleSave}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </Button>
            <Button
              onClick={handleGeneratePDF}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Generate PDF
            </Button>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                  INVOICE
                </h2>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Invoice Number:</span>
                    <EditableField
                      value={invoiceData.invoiceNumber}
                      onChange={(value) =>
                        setInvoiceData((prev) => ({
                          ...prev,
                          invoiceNumber: value,
                        }))
                      }
                      className="w-32"
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Date:</span>
                    <EditableField
                      value={invoiceData.date}
                      onChange={(value) =>
                        setInvoiceData((prev) => ({ ...prev, date: value }))
                      }
                      className="w-32"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Due Date:</span>
                    <EditableField
                      value={invoiceData.dueDate}
                      onChange={(value) =>
                        setInvoiceData((prev) => ({ ...prev, dueDate: value }))
                      }
                      className="w-32"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* From/To Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  From:
                </h3>
                <div className="space-y-2">
                  <EditableField
                    value={invoiceData.from.name}
                    onChange={(value) => updateFromField("name", value)}
                    placeholder="Your Company Name"
                    className="font-medium"
                  />
                  <EditableField
                    value={invoiceData.from.address}
                    onChange={(value) => updateFromField("address", value)}
                    placeholder="Address"
                  />
                  <EditableField
                    value={invoiceData.from.city}
                    onChange={(value) => updateFromField("city", value)}
                    placeholder="City, State ZIP"
                  />
                  <EditableField
                    value={invoiceData.from.email}
                    onChange={(value) => updateFromField("email", value)}
                    placeholder="Email"
                  />
                  <EditableField
                    value={invoiceData.from.phone}
                    onChange={(value) => updateFromField("phone", value)}
                    placeholder="Phone"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  To:
                </h3>
                <div className="space-y-2">
                  <EditableField
                    value={invoiceData.to.name}
                    onChange={(value) => updateToField("name", value)}
                    placeholder="Client Name"
                    className="font-medium"
                  />
                  <EditableField
                    value={invoiceData.to.address}
                    onChange={(value) => updateToField("address", value)}
                    placeholder="Address"
                  />
                  <EditableField
                    value={invoiceData.to.city}
                    onChange={(value) => updateToField("city", value)}
                    placeholder="City, State ZIP"
                  />
                  <EditableField
                    value={invoiceData.to.email}
                    onChange={(value) => updateToField("email", value)}
                    placeholder="Email"
                  />
                  <EditableField
                    value={invoiceData.to.phone}
                    onChange={(value) => updateToField("phone", value)}
                    placeholder="Phone"
                  />
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                    <div className="col-span-5">Description</div>
                    <div className="col-span-2">Quantity</div>
                    <div className="col-span-2">Rate</div>
                    <div className="col-span-2">Amount</div>
                    {!isPreview && <div className="col-span-1">Action</div>}
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {invoiceData.items.map((item) => (
                    <div key={item.id} className="px-4 py-3">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-5">
                          <EditableField
                            value={item.description}
                            onChange={(value) =>
                              updateItem(item.id, "description", value)
                            }
                            placeholder="Item description"
                            multiline
                          />
                        </div>
                        <div className="col-span-2">
                          <EditableField
                            value={item.quantity.toString()}
                            onChange={(value) =>
                              updateItem(
                                item.id,
                                "quantity",
                                parseInt(value) || 0
                              )
                            }
                            placeholder="1"
                          />
                        </div>
                        <div className="col-span-2">
                          <EditableField
                            value={item.rate.toString()}
                            onChange={(value) =>
                              updateItem(
                                item.id,
                                "rate",
                                parseFloat(value) || 0
                              )
                            }
                            placeholder="0.00"
                          />
                        </div>
                        <div className="col-span-2">
                          <div className="p-2 text-right font-medium">
                            ${item.amount.toFixed(2)}
                          </div>
                        </div>
                        {!isPreview && (
                          <div className="col-span-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {!isPreview && (
                <Button
                  variant="outline"
                  onClick={addItem}
                  className="mt-4 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </Button>
              )}
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64 space-y-2">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    ${invoiceData.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tax (10%):</span>
                  <span className="font-medium">
                    ${invoiceData.tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-200">
                  <span className="text-xl font-bold text-gray-900">
                    Total:
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    ${invoiceData.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Notes:
              </h3>
              <EditableField
                value={invoiceData.notes}
                onChange={(value) =>
                  setInvoiceData((prev) => ({ ...prev, notes: value }))
                }
                placeholder="Additional notes..."
                multiline
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
