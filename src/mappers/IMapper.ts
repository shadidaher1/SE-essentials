
export interface IMapper<T, U> {
  map(input: T): U;
}