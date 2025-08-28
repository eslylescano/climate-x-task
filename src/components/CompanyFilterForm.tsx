interface CompanyFilterFormProps {
  filterId: string;
  setFilterId: (id: string) => void;
  onFilter: (companyId?: string) => void;
}

export default function CompanyFilterForm({
  filterId,
  setFilterId,
  onFilter,
}: CompanyFilterFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFilter(filterId.trim() || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
      <input
        type="text"
        placeholder="Filter by Company ID"
        value={filterId}
        onChange={(e) => setFilterId(e.target.value)}
        className="border px-2 py-1 rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        Filter
      </button>
      <button
        type="button"
        className="ml-2 text-gray-600 underline"
        onClick={() => {
          setFilterId("");
          onFilter();
        }}
      >
        Clear
      </button>
    </form>
  );
}
