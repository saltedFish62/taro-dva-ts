import { AimState, TaskState } from 'src/constants/enums'
import services from 'src/services'
import dayjs from 'dayjs'
import { concat, map, max } from 'lodash'
import { Task } from 'src/types'

export default {
  namespace: 'index',
  state: {
    aim: {
      title: '',       // 目标标题
      subtitle: '',    // 口号
      id: '',          // id
      date: 0,         // ddl
      state: AimState.Current, // 状态
      popupVisibility: false, // 是否打开弹框
    },
    milestones: [],    // 里程碑
    todos: [],         // 今日事项
    scrollable: true,  // 首页是否可以滚动
  },
  effects: {
    * createAim({ payload }, { call, put }) {
      const { aim, slogan, date, } = payload
      const res = yield call(services.Aim.createAim, {
        title: aim,
        subtitle: slogan,
        date,
      })
      if (res) {
        yield put({
          type: 'updateAim',
          payload: res,
        })
        yield put({
          type: 'closeAimPopup'
        })
      }
    },
    * fetchAim(_: any, { call, put }: any) {
      const res = yield call(services.Aim.retrieveCurrentAim)
      if (res.length > 0) {
        yield put({
          type: 'updateAim',
          payload: res[0]
        })
      }
    },
    * createMilestone({ payload }, { call, put, select }) {
      const { aim, desc, reward } = payload
      const state = yield select(state => state.index)
      const res = yield call(services.Aim.createMilestone, {
        aim,
        desc,
        reward,
        aimId: state.aim.id,
        index: state.milestones.length,
      })
      if (res) {
        yield put({
          type: 'updateMilestones',
          payload: res,
        })
      }
    },
    * fetchTasks(_action, { call, put }) {
      const res = yield call(services.Todo.list)
      yield put({
        type: 'updateTasks',
        payload: res
      })
    },
    * createTask({ payload }, { call, put, select }) {
      const { todos } = yield select(state => state.index)
      const { plan, expireAt } = payload

      const now = dayjs().format('YYYY-MM-DD')

      const req: Task = {
        plan,
        sort: max(map(todos, it => it.sort)) + 1 || 0,
        expireAt,
        state: TaskState.Waiting,
        date: now,
      }

      const res = yield call(services.Todo.create, req)
      yield put({
        type: 'updateTasks',
        payload: concat(todos, res)
      })
    },
  },
  reducers: {
    updateAim(state: { aim: any; }, { payload: aim }: any) {
      return {
        ...state,
        aim: Object.assign(state.aim, {
          id: aim._id,
          date: aim.date,
          title: aim.title,
          subtitle: aim.subtitle,
          state: aim.state,
        }),
        milestones: aim.milestones || [],
      }
    },
    updateMilestones(state, { payload }) {
      return {
        ...state,
        milestones: payload.milestones
      }
    },
    updateTasks(state, { payload }) {
      return {
        ...state,
        todos: payload,
      }
    },
    openAimPopup(state) {
      return {
        ...state,
        aim: Object.assign(state.aim, {
          popupVisibility: true
        }),
      }
    },
    closeAimPopup(state) {
      return {
        ...state,
        aim: Object.assign(state.aim, {
          popupVisibility: false
        }),
      }
    },
  },
}