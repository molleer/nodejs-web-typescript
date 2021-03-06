import { SelectQueryBuilder } from 'typeorm';
import { validateAsync, arg } from 'validatorjs-decorator';

interface PaginationFormat {
  length: number;
  total: number;
  page: number;
  limit: number;
  from: number;
  to: number;
}

class Paginate<T> {
  private readonly query: SelectQueryBuilder<T>;

  constructor(query: SelectQueryBuilder<T>) {
    this.query = query;
  }

  @validateAsync()
  async get(
    @arg('page', 'integer|min:1') page: number = 1,
    @arg('limit', 'integer|min:1') limit: number = 10,
  ) {
    const total = await this.query.getCount();

    const skippedItems = (page - 1) * limit;

    const resultPagination = this.query.offset(skippedItems).limit(limit);

    const data = await resultPagination.getMany();
    const to = (page) * limit;
    const from = (page - 1) * limit;

    const pagination: PaginationFormat = {
      length: data.length,
      total,
      page,
      limit,
      from: (from < total) ? from : total,
      to: (to < total) ? to : total,
    };

    return {
      pagination,
      data,
    };
  }
}

export default Paginate;
