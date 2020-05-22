const delay = () => new Promise(res => setTimeout(res, 1000))

export default {
  namespace: 'common',
  state: {
    count: 0,
  },
  effects: {
    * asyncAdd({ }, { call, put }) {
      yield call(delay)
      yield put({
        type: 'add'
      })
    },
  },
  reducers: {
    add(state) {
      return {
        ...state,
        count: state.count + 1,
      }
    }
  }
}