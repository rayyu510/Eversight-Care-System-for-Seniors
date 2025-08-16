export class QueryBuilder {
  private query = '';

  select(columns: string[] = ['*']): QueryBuilder {
    this.query = `SELECT ${columns.join(', ')}`;
    return this;
  }

  build(): string {
    return this.query;
  }
}
