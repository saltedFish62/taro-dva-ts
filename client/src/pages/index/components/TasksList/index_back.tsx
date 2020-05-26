import { sortBy, forEach, map } from 'lodash'
import Taro, { Component } from '@tarojs/taro'
import { View, MovableArea, MovableView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { ComponentClass } from 'react'

import TaskItem from '../TaskItem'

import './index.scss'
import { Task } from 'src/types'

type OwnProps = {
  onSortChange: Function
}

type ModelProps = {
  list: Task[],
  dispatch: Function
}

interface TasksList {
  props: OwnProps & ModelProps
}

const initialState = {
  scrollTop: 0,          // ScrollView 滚动的高度
  containerTop: 0,       // SrcollView 顶部相对于屏幕的位置
  containerHeight: 300,  // ScrollView 的高度
  draggableHeight: 300,  // 可拖拽区域的高度
  draggingOffset: 0,     // 正在拖拽的事项的顶部与手指的偏置值
  draggingY: 0,          // 正在拖拽的事项在容器中的位置
  draggingId: '',        // 正在拖拽的事项的 id
  draggingPreId: '',     // 正在拖拽的事项的前一项
  draggingNexId: '',     // 正在拖拽的事项的后一项
  idPosMap: {},          // id 和事项位置映射
}

type State = Readonly<typeof initialState>

@connect(({ index }) => ({
  list: index.todos
}))
class TasksList extends Component {

  state: State = initialState

  componentDidMount = async () => {
    const { dispatch } = this.props
    await dispatch({
      type: 'index/fetchTasks'
    })
    await this.initHeight()
  }

  // 初始化 ScrollView 的高度
  async initHeight() {
    Taro.createSelectorQuery()
      .in(this.$scope)
      .selectAll('.task-list-container')
      .boundingClientRect()
      .exec(res => {
        const { screenHeight } = Taro.getSystemInfoSync()
        const containerTop = res[0][0].top
        const containerHeight = screenHeight - containerTop
        this.setState({ containerHeight, containerTop })
      })
  }

  // 更新整个列表
  async updateList() {
    const { list } = this.props
    console.log('init list', list)

    const idHeightMap = await this.getItemIdHeightMap()
    let draggableHeight = 0
    for (const k in idHeightMap) {
      draggableHeight += idHeightMap[k]
    }

    const idPosMap = {}
    const sortedList = sortBy(list, 'sort')
    let acc = 0
    forEach(sortedList, it => {
      idPosMap[it._id!] = {
        y: acc,
        sort: it.sort,
        height: idHeightMap[it._id!]
      }
      acc += idHeightMap[it._id!]
    })

    this.setState({
      idPosMap, draggableHeight
    })
  }

  /**
   * 获取每个节点的id和高度的映射
   * @returns {Object} { id: height }
   */
  getItemIdHeightMap(): object {
    return new Promise((resolve) => {
      Taro.createSelectorQuery()
        .in(this.$scope)
        .selectAll('.task__item')
        .boundingClientRect()
        .exec(res => {
          const result = {}
          res[0].forEach(it => {
            result[it._id] = it.height
          })
          resolve(result)
        })
    })
  }

  // 获取 Draggable area 的顶部高度
  getAreaPos() {
    return new Promise(resolve => {
      Taro.createSelectorQuery()
        .in(this.$scope)
        .selectAll('.tasks')
        .boundingClientRect()
        .exec(res => {
          resolve(res[0][0].top)
        })
    })
  }

  getItemTop(id): Promise<number> {
    return new Promise(resolve => {
      Taro.createSelectorQuery()
        .in(this.$scope)
        .select('#' + id)
        .boundingClientRect()
        .exec(res => {
          resolve(res[0].top)
        })
    })
  }

  updateSrcollTop({ detail: { scrollTop } }) {
    this.setState({ scrollTop })
  }

  async onItemLongPress(e) {
    const { touches, currentTarget: { id } } = e
    const { idPosMap } = this.state

    const top = await this.getItemTop(id)
    const touch = touches[0].clientY
    const draggingOffset = touch - top

    const [draggingPreId, draggingNexId] = this.findNeiborght(id)

    this.setState({
      draggingId: id,
      draggingOffset,
      draggingY: idPosMap[id].y,
      draggingPreId,
      draggingNexId,
    })
  }

  findNeiborght(id) {
    const {
      idPosMap
    } = this.state
    let prevItem: string = ''
    let nextItem: string = ''
    for (let key in idPosMap) {
      if (prevItem && nextItem) return [prevItem, nextItem]

      if (idPosMap[id].sort == idPosMap[key].sort - 1) prevItem = key
      else if (idPosMap[id].sort == idPosMap[key].sort + 1) nextItem = key
    }
    return [prevItem, nextItem]
  }

  /**
   * 是否需要换位
   * @param {string} itemId
   */
  needSwap(itemId) {
    const { draggingY, idPosMap, draggingId } = this.state
    const item = idPosMap[itemId]
    const draggingItem = idPosMap[draggingId]

    const itemMidLine = item.y + item.height / 2
    const draggingItemMidLine = draggingY + draggingItem.height / 2

    return (draggingItem.sort - item.sort) * (draggingItemMidLine - itemMidLine) < 0
  }

  /**
   * 将事项与被拖拽的事项换位
   * @param {string} itemId 
   */
  swapItem(itemId) {
    const {
      idPosMap: map,
      draggingId,
    } = this.state

    // swap y
    if (map[itemId].sort > map[draggingId].sort) {
      // 若被动的节点在下方
      map[itemId].y = map[draggingId].y
      map[draggingId].y = map[itemId].y + map[itemId].height
    } else {
      map[draggingId].y = map[itemId].y
      map[itemId].y = map[draggingId].y + map[draggingId].height
    }

    // swap sort
    const tempSort = map[itemId].sort
    map[itemId].sort = map[draggingId].sort
    map[draggingId].sort = tempSort

    const [draggingPreId, draggingNexId] = this.findNeiborght(draggingId)

    this.setState({
      idPosMap: map,
      draggingPreId,
      draggingNexId,
    })
  }

  onItemTouchEnd({ currentTarget: { id } }) {
    const { idPosMap } = this.state
    this.setState({
      draggingY: idPosMap[id].y,
    })

    const { onSortChange, list } = this.props
    const sortedList = map(list, it => ({
      ...it,
      sort: idPosMap[it._id!].sort,
    }))
    if (onSortChange) onSortChange({ list: sortedList })

    setTimeout(() => {
      this.setState({ draggingId: '' })
    }, 300)
  }

  onItemTouchMove({ touches }) {
    const touch = touches[0].clientY
    const {
      scrollTop,
      containerTop,
      draggingOffset,
      draggingPreId,
      draggingNexId,
      draggingId,
    } = this.state
    if (!draggingId) return
    const draggingY = touch - draggingOffset - containerTop - scrollTop
    this.setState({ draggingY })

    if (draggingPreId && this.needSwap(draggingPreId)) {
      this.swapItem(draggingPreId)
    } else if (draggingNexId && this.needSwap(draggingNexId)) {
      this.swapItem(draggingNexId)
    }
  }

  render() {
    const { list = [] } = this.props

    const {
      draggableHeight,
      idPosMap,
      draggingId,
      draggingY,
    } = this.state

    return (
      <MovableArea
        className='draggable'
        style={{ height: draggableHeight + 'px' }}
      >
        {
          list.map(it => (
            <MovableView
              className='draggable__item'
              key={it._id}
              y={draggingId == it._id ? draggingY : idPosMap[it._id!].y}
              style={{ zIndex: draggingId == it._id ? 99 : 0 }}
              disabled={draggingId != it._id}
              direction='vertical'
              damping={100}
              animation={draggingId != it._id}
            >
              <View
                className={'task__item' + (draggingId == it._id ? ' task__item--dragging' : '')}
                id={it._id}
                onLongPress={this.onItemLongPress}
                onTouchMove={this.onItemTouchMove}
                onTouchEnd={this.onItemTouchEnd}
              >
                <TaskItem {...it}></TaskItem>
              </View>
            </MovableView>
          ))
        }
      </MovableArea>
    )
  }
}

export default TasksList as ComponentClass<OwnProps>