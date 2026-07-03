export interface HomeBackground {
  id: number;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedHomeBackground {
  data: HomeBackground[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
