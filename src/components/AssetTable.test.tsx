import { render, screen } from "@testing-library/react";
import AssetTable from "./AssetTable";
import { Asset } from "@/types/asset";

describe("AssetTable component", () => {
  const assets: Asset[] = [
    { address: "123 Main St", latitude: 51.5, longitude: -0.1 },
    { address: "456 Elm St", latitude: 40.7, longitude: -74 },
  ];

  it("renders loading spinner when isLoading is true", () => {
    render(<AssetTable assets={[]} isLoading={true} />);
    const spinner = screen.getByRole("status"); // we'll add role in spinner div for accessibility
    expect(spinner).toBeInTheDocument();
  });

  it("renders table headers", () => {
    render(<AssetTable assets={assets} />);
    expect(screen.getByText(/Address/i)).toBeInTheDocument();
    expect(screen.getByText(/Latitude/i)).toBeInTheDocument();
    expect(screen.getByText(/Longitude/i)).toBeInTheDocument();
  });

  it("renders all asset rows", () => {
    render(<AssetTable assets={assets} />);
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
    expect(screen.getByText("51.5")).toBeInTheDocument();
    expect(screen.getByText("-0.1")).toBeInTheDocument();

    expect(screen.getByText("456 Elm St")).toBeInTheDocument();
    expect(screen.getByText("40.7")).toBeInTheDocument();
    expect(screen.getByText("-74")).toBeInTheDocument();
  });

  it('renders "No assets found" when asset list is empty and not loading', () => {
    render(<AssetTable assets={[]} />);
    expect(screen.getByText(/No assets found/i)).toBeInTheDocument();
  });
});
