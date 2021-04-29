interface State<T> {
  data: T[];
  done: boolean;
  rowsInEdit: Map<number, T>;
  newPosition: T;
}

export default State;
