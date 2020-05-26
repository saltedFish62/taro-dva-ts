import {reduce} from 'lodash'
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
}

type State = Readonly<typeof initialState>

@connect(({ index }) => ({
  list: index.todos
}))
class TasksList extends Taro.Component {

  state: State = initialState

  componentDidUpdate({ list }) {
    const { listLen } = this.state
    if (list && list.length != listLen) {
      this.initHeight()
    }
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
      const height = idHeightMap[it._id!]
      idPosMap[it._id!] = {
        height,
        y: res,
        sort: it.sort,
      }
      return res + height + 1
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

  onLongClick = (id) => {
    this.setState({
      draggingId: id
    })
  }

  onDragging = (e) => {
    console.log(e)
  }

  render() {
    const { list } = this.props

    const {
      areaHeight,
      idPosMap,
      draggingId,
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
          list.map(it => (
            <MovableView
              key={it._id}
              className="draggable__item"
              direction="vertical"
              disabled={it._id === draggingId}
              outOfBounds={true}
              damping={166}
              friction={2}
              y={idPosMap[it._id!].y}
              style={{
                zIndex: idPosMap[it._id!] ? idPosMap[it._id!].sort : 0
              }}
              onLongClick={() => {
                this.onLongClick(it._id)
              }}
              onVTouchMove={(e) => this.onDragging(e)}
            >
              <View
                className="task__item"
                id={it._id}
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