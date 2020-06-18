import { AimState, TaskState } from 'src/constants/enums'
import services from 'src/services'
import { concat, map, max } from 'lodash'
import { Task, Milestone } from 'src/types'

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
    tasks: [],         // 今日事项
  },
  effects: {
    * init(_action: any, { call, put }) {
      // 拉正在进行的目标
      const aim = yield call(services.Aim.retrieveCurrentAim)
      if (!aim || Object.keys(aim).length === 0) return
      yield put({ type: 'mergeAim', payload: aim })

      // 查该目标的里程碑
      const milestones = yield call(services.Milestone.list, aim.id)
      yield put({ type: 'mergeMilestones', payload: { milestones } })
    },

    * createAim({ payload }, { call, put }) {
      const { aim, slogan, date, } = payload
      const res = yield call(services.Aim.create, {
        title: aim,
        subtitle: slogan,
        date,
      })
      if (res) {
        yield put({ type: 'mergeAim', payload: res, })
        yield put({ type: 'closeAimPopup' })
      }
    },

    * fetchAim(_: any, { call, put }: any) {
      const res = yield call(services.Aim.retrieveCurrentAim)
      if (res.length > 0) {
        yield put({
          type: 'mergeAim',
          payload: res[0]
        })
      }
    },

    * updateAim({ payload }, { call, put }) {
      const { id } = payload
      const res = yield call(services.Aim.update, payload)
      if (res > 0) {
        const aim = yield call(services.Aim.retrieve, id)
        yield put({
          type: 'mergeAim',
          payload: aim
        })
      }
    },

    * createMilestone({ payload }, { call, put, select }) {
      const { aim, desc, reward } = payload
      const state = yield select(state => state.index)
      const aim_id = state.aim.id
      const res = yield call(services.Milestone.create, {
        aim,
        desc,
        reward,
        aim_id,
      } as Milestone)
      if (res) {
        const milestones = yield call(services.Milestone.list, aim_id)
        yield put({
          type: 'mergeMilestones',
          payload: { milestones },
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
      const { tasks } = yield select(state => state.index)
      const { plan, minutes } = payload


      const req: Task = {
        plan,
        minutes,
        sort: max(map(tasks, it => it.sort)) + 1 || 0,
        state: TaskState.Waiting,
      }

      const res = yield call(services.Todo.create, req)
      yield put({
        type: 'updateTasks',
        payload: concat(tasks, res)
      })
    },
  },
  reducers: {
    mergeAim(state: { aim: any; }, { payload: aim }: any) {
      return {
        ...state,
        aim: aim,
      }
    },
    mergeMilestones(state, { payload }) {
      return {
        ...state,
        milestones: payload.milestones
      }
    },
    clearAim(state) {
      return {
        ...state,
        aim: {},
        milestones: []
      }
    },
    updateTasks(state, { payload }) {
      return {
        ...state,
        tasks: payload,
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