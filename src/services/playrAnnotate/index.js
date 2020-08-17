import { triggerEvent } from 'plyr/src/js/utils/events'
import nanoid from 'nanoid'
import rcolor from 'rcolor'
import merge from 'lodash.merge'

class PlayrAnnotate {
  constructor(player) {
    this.player = player

    // public methods available
    this.player.annotate = {
      player: player,
      plugin: this,
      add: this.addAnnotation,
      delete: this.deleteAnnotation,
      highlight: this.activateAnnotation,
      deemphasize: this.deactivateAnnotations,
      destroyPlyr: this.player.destroy.bind(this.player),
    }
    this.player.destroy = this.destroy

    this.player.on('ready', event => {
      const playerInstance = event.detail.plyr
      this._bindEvents(playerInstance)
    })

    return this.player
  }

  destroy(...args) {
    this.annotate.plugin._unbindEvents(this.annotate.player)
    return this.annotate.destroyPlyr(...args)
  }

  deleteAnnotation(id) {
    const index = this.player.annotations.findIndex(
      annotation => annotation.id === id
    )
    if (index > -1) {
      this.player.annotations[index].startEl.parentNode.removeChild(
        this.player.annotations[index].startEl
      )

      if (typeof this.player.annotations[index].endEl !== 'undefined')
        this.player.annotations[index].endEl.parentNode.removeChild(
          this.player.annotations[index].endEl
        )
      if (typeof this.player.annotations[index].blockEl !== 'undefined')
        this.player.annotations[index].blockEl.parentNode.removeChild(
          this.player.annotations[index].blockEl
        )

      this.player.annotations.splice(index, 1)
    }
  }

  updateAnnotation(id, data = {}, player = null) {
    const $player = player || this
    const index = $player.annotations.findIndex(
      annotation => annotation.id === id
    )
    if (index > -1) {
      $player.annotations[index] = merge($player.annotations[index], data)
    }
  }

  addAnnotation(newAnnotations = []) {
    const $this = this.plugin
    const $player = this.player

    if (!Array.isArray(newAnnotations)) newAnnotations = [newAnnotations]

    if (typeof $player.annotations !== 'undefined') {
      newAnnotations.forEach(annotation => {
        if (annotation.end && annotation.end > $player.duration)
          annotation.end = $player.duration
        if (annotation.end && annotation.end === annotation.start)
          delete annotation.end

        if (!$player.annotations.includes(annotation)) {
          $player.annotations.push(annotation)
        }
      })
    } else {
      $player.annotations = newAnnotations
    }

    $this._redraw({ player: $player })
  }

  activateAnnotation(id) {
    const $player = this.player
    const index = $player.annotations.findIndex(
      annotation => annotation.id === id
    )
    if (
      index > -1 &&
      typeof $player.annotations[index].blockEl !== 'undefined'
    ) {
      $player.annotations[index].blockEl.classList.add('-active')
    }
  }

  deactivateAnnotations() {
    const $player = this.player
    $player.annotations.forEach(annotation => {
      if (typeof annotation.blockEl !== 'undefined') {
        annotation.blockEl.classList.remove('-active')
      }
    })
  }

  _unbindEvents(player) {
    window.removeEventListener('resize', () => this._resize({ player }))
    player.elements.progress.removeEventListener('mousemove', () =>
      this._onMouseMove({ event, player })
    )
    player.elements.progress.removeEventListener('mouseleave', () =>
      this._onMouseLeave({ player })
    )
  }

  _bindEvents(player) {
    window.addEventListener('resize', () => this._resize({ player }))
    player.elements.progress.addEventListener('mousemove', () =>
      this._onMouseMove({ event, player })
    )
    player.elements.progress.addEventListener('mouseleave', () =>
      this._onMouseLeave({ player })
    )
  }

  _onMouseMove({ event, player }) {
    this._dragging({ instance: player.annotate, event })
  }

  _onMouseLeave({ player }) {
    this._deactivateBlock({ instance: player.annotate })
    this._deactivateHandle({ instance: player.annotate })
  }

  _resize({ player }) {
    this._redraw({ player })
  }

  _redraw({ player }) {
    const $this = player.annotate.plugin

    let tmp = []
    player.annotations.forEach(annotation => {
      tmp.push({
        start: annotation.start,
        end: annotation.end,
        data: annotation.data,
        color: annotation.color,
      })

      if (typeof annotation.blockEl !== 'undefined')
        annotation.blockEl.parentNode.removeChild(annotation.blockEl)
      if (typeof annotation.startEl !== 'undefined')
        annotation.startEl.parentNode.removeChild(annotation.startEl)
      if (typeof annotation.endEl !== 'undefined')
        annotation.endEl.parentNode.removeChild(annotation.endEl)
    })

    player.annotations = []

    tmp.forEach((annotation, index) => {
      player.annotations[index] = annotation

      let isSection = typeof annotation.end !== 'undefined'

      annotation.id = nanoid()
      if (typeof annotation.color === 'undefined') {
        annotation.color = rcolor()
      }

      if (isSection) {
        player.annotations[index]['startEl'] = $this._createHandleEl({
          player: player,
          id: annotation.id,
          leftPos:
            (annotation.start * player.elements.progress.clientWidth) /
            player.duration,
          type: 'start',
          color: annotation.color,
        })
        player.annotations[index]['endEl'] = $this._createHandleEl({
          player: player,
          id: annotation.id,
          leftPos:
            (annotation.end * player.elements.progress.clientWidth) /
            player.duration,
          type: 'end',
          color: annotation.color,
        })
        player.annotations[index]['blockEl'] = $this._createHandlesBlock({
          id: annotation.id,
          player: player,
          leftHandle: player.annotations[index]['startEl'],
          rightHandle: player.annotations[index]['endEl'],
          color: annotation.color,
        })
      } else {
        player.annotations[index]['startEl'] = $this._createHandleEl({
          player: player,
          id: annotation.id,
          leftPos:
            (annotation.start * player.elements.progress.clientWidth) /
            player.duration,
          type: 'tag',
          color: annotation.color,
        })
      }
    })

    player.annotations = $this._sortAnnotations(player.annotations)
    triggerEvent.call(player, player.elements.container, 'annotationschange')
  }

  _sortAnnotations(annotations) {
    function compare(a, b) {
      if (a.start < b.start) return -1
      if (a.start > b.start) return 1
      return 0
    }

    return annotations.sort(compare)
  }

  _createHandlesBlock({
    player,
    leftHandle,
    id,
    rightHandle,
    color = '#ffffff',
  }) {
    let leftHandlePosX =
      leftHandle.getBoundingClientRect().left -
      player.elements.progress.getBoundingClientRect().left +
      leftHandle.offsetWidth / 2

    let rightHandlePosX =
      rightHandle.getBoundingClientRect().left -
      player.elements.progress.getBoundingClientRect().left

    let block = document.createElement('div')
    block.classList.add('plyr__annotate__block')
    block.style.left = leftHandlePosX + 'px'
    block.style.width =
      rightHandlePosX - leftHandlePosX + leftHandle.offsetWidth / 2 + 'px'
    block.style.backgroundColor = `${color}`
    block.dataset.id = id

    block.addEventListener('mousedown', event => {
      this._activateBlock({ instance: player.annotate, blockEl: block, event })
    })
    block.addEventListener('mouseup', () => {
      this._deactivateBlock({ instance: player.annotate })
    })
    block.addEventListener('touchend', () => {
      this._deactivateBlock({ instance: player.annotate })
    })

    player.elements.progress.appendChild(block)

    return block
  }

  _createHandleEl({
    player,
    id,
    leftPos = 0,
    type = 'add',
    color = '#ffffff',
  }) {
    let handle = document.createElement('div')
    handle.classList.add('plyr__annotate__handle', `-${type}`)
    if (type !== 'add') handle.classList.add('-visible')
    handle.style.left = leftPos + 'px'
    handle.dataset.id = id
    handle.dataset.type = type

    let handleBar = document.createElement('div')
    handleBar.classList.add('plyr__annotate__handle__bar')
    handle.appendChild(handleBar)

    let handleSymbol = document.createElement('div')
    handleSymbol.classList.add('plyr__annotate__handle__symbol')
    handleSymbol.style.borderColor =
      type === 'start'
        ? `transparent transparent transparent ${color}`
        : `transparent transparent ${color} transparent`
    handleSymbol.style.color = color
    handle.appendChild(handleSymbol)

    handle.addEventListener('mousedown', event => {
      this._activateHandle({
        instance: player.annotate,
        handleEl: handle,
        event,
      })
    })
    handle.addEventListener('mouseup', () => {
      this._deactivateHandle({ instance: player.annotate })
    })
    handle.addEventListener('touchend', () => {
      this._deactivateHandle({ instance: player.annotate })
    })

    player.elements.progress.appendChild(handle)

    return handle
  }

  _activateHandle({ instance, handleEl, event }) {
    instance.plugin.activeHandle = handleEl
    instance.plugin.activeHandleOffset =
      event.clientX - handleEl.getBoundingClientRect().left

    const annotationId = handleEl.dataset.id
    const index = instance.player.annotations.findIndex(
      annotation => annotation.id === annotationId
    )
    instance.plugin.dragAnnotation = instance.player.annotations[index]

    if (typeof instance.plugin.dragAnnotation.blockEl !== 'undefined') {
      instance.plugin.dragAnnotation.blockEl.classList.add('-active')
    }
  }

  _activateBlock({ instance, blockEl, event }) {
    instance.plugin.activeBlock = blockEl
    instance.plugin.activeBlockOffset =
      event.clientX - blockEl.getBoundingClientRect().left

    const annotationId = blockEl.dataset.id
    const index = instance.player.annotations.findIndex(
      annotation => annotation.id === annotationId
    )
    instance.plugin.dragAnnotation = instance.player.annotations[index]

    instance.plugin.dragAnnotation.blockEl.classList.add('-active')
  }

  _deactivateBlock({ instance }) {
    if (instance.plugin.activeBlock) {
      instance.plugin.activeBlock = false
      instance.plugin.dragAnnotation.blockEl.classList.remove('-active')
    }
  }

  _deactivateHandle({ instance }) {
    if (instance.plugin.activeHandle) {
      instance.plugin.activeHandle = false

      if (typeof instance.plugin.dragAnnotation.blockEl !== 'undefined') {
        instance.plugin.dragAnnotation.blockEl.classList.remove('-active')
      }
    }
  }

  _dragging({ instance, event }) {
    if (instance.plugin.activeHandle) {
      let leftPos =
        event.clientX -
        instance.player.elements.progress.getBoundingClientRect().left
      let minPos = instance.player.elements.progress.getBoundingClientRect()
        .left
      let maxPos =
        instance.player.elements.progress.getBoundingClientRect().left +
        instance.player.elements.progress.offsetWidth

      if (event.clientX < minPos)
        instance.plugin.activeHandle.style.left =
          minPos -
          instance.player.elements.progress.getBoundingClientRect().left +
          'px'
      else if (event.clientX > maxPos)
        instance.plugin.activeHandle.style.left =
          maxPos -
          instance.player.elements.progress.getBoundingClientRect().left +
          'px'
      else instance.plugin.activeHandle.style.left = leftPos + 'px'

      const clientRect = instance.player.elements.progress.getBoundingClientRect()
      const percentage =
        (100 / clientRect.width) * (event.pageX - clientRect.left)
      const seekTime = instance.player.duration * (percentage / 100)

      const updatedData =
        instance.plugin.activeHandle.dataset.type != 'end'
          ? { start: seekTime }
          : { end: seekTime }

      instance.plugin.updateAnnotation(
        instance.plugin.dragAnnotation.id,
        updatedData,
        instance.player
      )
      instance.player.annotations = instance.plugin._sortAnnotations(
        instance.player.annotations
      )

      if (typeof instance.plugin.dragAnnotation.blockEl !== 'undefined') {
        instance.plugin.dragAnnotation.blockEl.style.left =
          instance.plugin.dragAnnotation.startEl.getBoundingClientRect().left +
          instance.plugin.dragAnnotation.startEl.offsetWidth / 2 -
          instance.player.elements.progress.getBoundingClientRect().left +
          'px'

        instance.plugin.dragAnnotation.blockEl.style.width =
          instance.plugin.dragAnnotation.endEl.getBoundingClientRect().left -
          instance.plugin.dragAnnotation.startEl.getBoundingClientRect().left +
          'px'
      }
    }

    if (instance.plugin.activeBlock) {
      let reverseBlockOffset =
        instance.plugin.activeBlock.offsetWidth -
        instance.plugin.activeBlockOffset

      let leftPos =
        event.clientX -
        instance.player.elements.progress.getBoundingClientRect().left
      let minPos =
        instance.player.elements.progress.getBoundingClientRect().left +
        instance.plugin.activeBlockOffset
      let maxPos =
        instance.player.elements.progress.getBoundingClientRect().left +
        instance.player.elements.progress.offsetWidth -
        reverseBlockOffset

      if (event.clientX < minPos) {
        instance.plugin.activeBlock.style.left =
          minPos -
          instance.player.elements.progress.getBoundingClientRect().left -
          instance.plugin.activeBlockOffset +
          'px'
      } else if (event.clientX > maxPos) {
        instance.plugin.activeBlock.style.left =
          maxPos -
          instance.player.elements.progress.getBoundingClientRect().left -
          instance.plugin.activeBlock.offsetWidth +
          reverseBlockOffset +
          'px'
      } else
        instance.plugin.activeBlock.style.left =
          leftPos - instance.plugin.activeBlockOffset + 'px'

      instance.plugin.dragAnnotation.startEl.style.left =
        instance.plugin.activeBlock.getBoundingClientRect().left -
        instance.player.elements.progress.getBoundingClientRect().left +
        'px'

      if (typeof instance.plugin.dragAnnotation.endEl !== 'undefined')
        instance.plugin.dragAnnotation.endEl.style.left =
          instance.plugin.activeBlock.getBoundingClientRect().left -
          instance.player.elements.progress.getBoundingClientRect().left +
          instance.plugin.activeBlock.offsetWidth +
          'px'

      const clientRect = instance.player.elements.progress.getBoundingClientRect()
      const percentageStart =
        (100 / clientRect.width) *
        (instance.plugin.dragAnnotation.startEl.getBoundingClientRect().left +
          instance.plugin.dragAnnotation.startEl.offsetWidth / 2 -
          clientRect.left)
      const percentageEnd =
        (100 / clientRect.width) *
        (instance.plugin.dragAnnotation.endEl.getBoundingClientRect().left +
          instance.plugin.dragAnnotation.startEl.offsetWidth / 2 -
          clientRect.left)
      const seekTimeStart = instance.player.duration * (percentageStart / 100)
      const seekTimeEnd = instance.player.duration * (percentageEnd / 100)

      const updatedData = {
        start: seekTimeStart,
        end: seekTimeEnd,
      }

      instance.plugin.updateAnnotation(
        instance.plugin.dragAnnotation.id,
        updatedData,
        instance.player
      )
      instance.player.annotations = instance.plugin._sortAnnotations(
        instance.player.annotations
      )
    }
  }
}

export default player => new PlayrAnnotate(player)
