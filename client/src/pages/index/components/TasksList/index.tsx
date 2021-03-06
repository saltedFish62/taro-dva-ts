import { reduce } from 'lodash'
import Taro from '@tarojs/taro'
import { View, MovableArea, MovableView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { ComponentClass } from 'react'

import TaskItem from '../TaskItem'

import './index.scss'
import { Task } from 'src/types'

type OwnProps = {}

type ModelProps = {
  list: Task[],
  dispatch: Function
}

interface TasksList {
  props: OwnProps & ModelProps
}

const initialState = {
  listLen: -1,     // 记录列表长度，当长度变化时刷新列表高度
  areaHeight: 0,   // movableArea 高度
  idPosMap: {},    // 节点的位置映射 { id: { y, sort, height } }
  draggingId: '',  // 正在拖拽节点
  draggingY: 0,    // 正在拖拽节点的位置
  startPageY: 0,   // 长按时手指的位置
  startY: 0,       // 长按时节点位置

  optionsOpenIdx: -1,  // 操作条打开的事件
}

type State = Readonly<typeof initialState>

@connect(({ index }) => ({
  list: index.tasks
}))
class TasksList extends Taro.Component {

  constructor(props) {
    super(props)
    this.onLongPress = this.onLongPress.bind(this)
  }

  state: State = initialState

  componentDidUpdate(_prevProps, { listLen }) {
    const { list } = this.props
    if (list && list.length != listLen) {
      this.initHeight()
    }
  }

  handleItemChange = async (idx, state) => {
    const { dispatch, list } = this.props
    if (state === -1) {
      // 删除 task
      await dispatch({
        type: 'index/deleteTask',
        payload: { id: list[idx].id }
      })
    } else {
      // 更新
      await dispatch({
        type: 'index/updateTask',
        payload: { id: list[idx].id, state }
      })
    }
    this.setState({
      optionsOpenIdx: -1,  // 操作条打开的事件
    })
  }

  initHeight = async () => {
    const { list } = this.props

    const idHeightMap = await this.getItemIdHeightMap()

    // 更新MovableArea高度
    let areaHeight = 0
    for (const k in idHeightMap) {
      areaHeight += idHeightMap[k]
    }

    // 各个节点的位置信息
    const idPosMap = {}
    reduce(list, (res, it) => {
      const height = idHeightMap[it.id!]
      idPosMap[it.id!] = {
        height,
        y: res,
        sort: it.sort,
      }
      return res + height
    }, 0)

    this.setState({
      listLen: list.length,
      areaHeight,
      idPosMap,
    })
  }

  /**
   * 获取每个节点的id和高度的映射
   * @returns {Object} { id: height }
   */
  getItemIdHeightMap(): object {
    const _this = this
    return new Promise((resolve) => {
      Taro.createSelectorQuery()
        .in(_this.$scope)
        .selectAll('.task__item')
        .boundingClientRect()
        .exec(res => {
          const result = {}
          res[0].forEach(it => {
            result[it.id] = it.height
          })
          resolve(result)
        })
    })
  }

  /**
   * 查找节点相邻的两个节点
   * [prevNodeId, nextNodeId]
   */
  findNeighbor = (id, idPosMap): string[] => {
    let prevNodeId: string = ''
    let nextNodeId: string = ''
    for (const key in idPosMap) {
      if (idPosMap[key].sort === idPosMap[id].sort - 1) {
        prevNodeId = key
      } else if (idPosMap[key].sort === idPosMap[id].sort + 1) {
        nextNodeId = key
      }
    }

    return [prevNodeId, nextNodeId]
  }

  /**
   * 检查是否需要换位
   */
  checkSwap = (prevNodeId, nextNodeId): void => {
    if (prevNodeId && this.needSwap(prevNodeId)) {
      // 向上换位
      this.swapItem(prevNodeId)
    } else if (nextNodeId && this.needSwap(nextNodeId)) {
      // 向下换位
      this.swapItem(nextNodeId)
    }
  }

  /**
   * 将事项与被拖拽的事项换位
   * @param {string} id 
   */
  swapItem(id) {
    const {
      idPosMap: map,
      draggingId,
    } = this.state

    // swap y
    if (map[id].sort > map[draggingId].sort) {
      // 若被动的节点在下方
      map[id].y = map[draggingId].y
      map[draggingId].y = map[id].y + map[id].height
    } else {
      map[draggingId].y = map[id].y
      map[id].y = map[draggingId].y + map[draggingId].height
    }

    // swap sort
    const tempSort = map[id].sort
    map[id].sort = map[draggingId].sort
    map[draggingId].sort = tempSort

    this.setState({
      idPosMap: map,
    })
  }

  /**
   * 是否需要换位
   */
  needSwap = (itemId: string): boolean => {
    const { draggingY, idPosMap, draggingId } = this.state
    const item = idPosMap[itemId]
    const draggingItem = idPosMap[draggingId]

    return (draggingItem.sort - item.sort) * (draggingY - item.y) < 0
  }

  onLongPress = (id, e) => {
    const { idPosMap } = this.state

    this.setState({
      draggingId: id,
      draggingY: idPosMap[id].y,
      startPageY: e.changedTouches[0].pageY,
      startY: idPosMap[id].y,
    })
  }

  onTouchEnd = () => {
    const { idPosMap, draggingId } = this.state
    if (!draggingId) return
    this.setState({ draggingY: idPosMap[draggingId].y })
    setTimeout(() => {
      this.setState({
        draggingId: '',
        startPageY: 0,
      })
    }, 300)
  }

  onTouchMove(e) {
    e.stopPropagation()
    const { pageY } = e.changedTouches[0]
    const { startPageY, idPosMap, draggingId, startY } = this.state
    if (!draggingId) return

    const offset = Math.floor(pageY - startPageY)
    const draggingY = startY + offset

    this.setState({
      draggingY,
    })

    const [prev, next] = this.findNeighbor(draggingId, idPosMap)
    if (prev && this.needSwap(prev)) {
      this.swapItem(prev)
    } else if (next && this.needSwap(next)) {
      this.swapItem(next)
    }
  }

  render() {
    const { list } = this.props

    const {
      areaHeight,
      idPosMap,
      draggingId,
      draggingY,
      optionsOpenIdx,
    } = this.state

    if (list.length < 1) {
      return (
        <View className='no-records'>今日暂无安排。太闲是不行的。</View>
      )
    }

    return (
      <MovableArea
        className="draggable"
        style={{ height: areaHeight + 'px' }}
      >
        {
          list.map((it, idx) => (
            <MovableView
              key={it.id}
              className="draggable__item"
              direction="vertical"
              disabled={true}
              outOfBounds={true}
              damping={36}
              animation={!(draggingId === it.id && draggingY !== idPosMap[it.id!].y)}
              y={draggingId === it.id ? draggingY : idPosMap[it.id!].y}
              style={{
                zIndex: draggingId === it.id || idx === optionsOpenIdx ? 999 : idPosMap[it.id!] && idPosMap[it.id!].sort
              }}
              onLongPress={(e) => { this.onLongPress(it.id, e) }}
              onTouchMove={this.onTouchMove}
              onTouchEnd={this.onTouchEnd}
            >
              <View
                className={draggingId === it.id ? 'task__item--dragging' : 'task__item'}
                id={it.id}
              >
                <TaskItem
                  {...it}
                  open={idx === optionsOpenIdx}
                  onOpen={() => { this.setState({ optionsOpenIdx: idx }) }}
                  onClose={() => { this.setState({ optionsOpenIdx: -1 }) }}
                  onChange={(state) => { this.handleItemChange(idx, state) }}
                ></TaskItem>
              </View>
            </MovableView>
          ))
        }
      </MovableArea>
    )
  }
}

export default TasksList as ComponentClass<OwnProps>