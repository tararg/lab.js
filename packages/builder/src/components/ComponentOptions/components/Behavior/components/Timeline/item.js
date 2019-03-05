import React, { createRef } from 'react'
import PropTypes from 'prop-types'
import { Group, Text, Rect, Circle } from 'react-konva'
import { clamp } from 'lodash'

import colors from './colors'

const Item = (
  { label, priority, start, stop, active, onClick, update },
  { range, calcPosition, closestLayerY, setCursor }
) => {
  const height = 36
  const { x, y, w } = calcPosition(start, stop, priority)

  // Difference between absolute and relative position
  // (populated and used during dragging for bound calculation)
  let translationX = 0

  const saveTranslation = target => {
    const { x: absX } = target.getAbsolutePosition()
    const { x } = target.getPosition()
    translationX = absX - x
  }
  const clearTranslation = () => {
    translationX = 0
  }

  // Refs
  const container = createRef()
  const box = createRef()
  const handleRight = createRef()

  return (
    <Group
      ref={ container }
      x={ x } y={ y }
      draggable
      dragBoundFunc={ ({ x, y }) => ({
        x: clamp(x - translationX, 0, range.max - w) + translationX,
        y: closestLayerY(y)
      }) }
      onDragStart={ function() {
        // UI drag cues
        setCursor('grabbing')
        box.current.shadowEnabled(true)

        // Save translation
        saveTranslation(this)
      } }
      onDragEnd={ () => {
        // UI drag cues
        box.current.shadowEnabled(active)
        setCursor('grab')

        // Remove translation
        clearTranslation()

        // Save position
        const { x, y } = container.current.position()
        const width = box.current.width()
        update({ x, y, width })
      } }
    >
      <Rect
        ref={ box }
        x={ 0.5 } y={ 0.5 }
        height={ height } width={ Math.max(w, 10) } // Minimum width
        cornerRadius={ 4 }
        fill={ active ? colors.active : 'white' }
        stroke={ active ? 'white' : colors.buttonBorder }
        strokeWidth={ 1 }
        onClick={ onClick }
        onMouseEnter={ () => setCursor('grab') }
        onMouseLeave={ () => setCursor('default') }
        shadowColor="rgba(0, 0, 0, 0.125)"
        shadowBlur={ 8 }
        shadowEnabled={ active }
      />
      <Text
        listening={ false }
        x={ 12 } y={ 12 }
        text={ label }
        fontFamily="Fira Sans"
        fontSize={ 14 }
        fill={ active ? 'white' : colors.root }
      />
      {/* TODO: Simplify the pesky rendering offsets */}
      <Circle
        visible={ active } listening={ active }
        x={ 0.5 } y={ height/2 } radius={ 6 }
        fill={ colors.active } stroke={ 'white' } strokeWidth={ 2 }
        draggable
        dragBoundFunc={ ({ x: dragX }) => ({
          x: clamp(dragX - translationX, 0.5, x + w + 0.5) + translationX,
          y: closestLayerY(y) + height/2
        }) }
        onDragStart={ function() {
          // Save translation
          saveTranslation(this)
        } }
        onDragMove={ (e) => {
          const { x: dragX } = e.target.getAbsolutePosition()
          const width = w - (dragX - translationX - 0.5 - x)
          container.current.position({ x: dragX - translationX - 0.5, y })

          // All other positions are relative to the container
          box.current.width(width)
          handleRight.current.position({ x: width, y: height/2 })
        } }
        onDragEnd={ () => {
          clearTranslation()
        } }
        onMouseEnter={ () => setCursor('ew-resize') }
        onMouseLeave={ () => setCursor('default') }
      />
      <Circle
        ref={ handleRight }
        visible={ active } listening={ active }
        x={ w + 0.5 } y={ height/2 } radius={ 6 }
        fill={ colors.active } stroke={ 'white' } strokeWidth={ 2 }
        draggable
        dragBoundFunc={ ({ x: dragX }) => ({
          // In absolute coordinates
          x: clamp(dragX - translationX, x, range.max) + translationX,
          y: closestLayerY(y) + height/2
        }) }
        onDragStart={ function() {
          // Save translation
          saveTranslation(this)
        } }
        onDragMove={ (e) => {
          box.current.width(
            // Remove circle offset
            e.target.getAbsolutePosition().x - translationX - 0.5 - x
          )
        } }
        onDragEnd={ () => {
          clearTranslation()
        } }
        onMouseEnter={ () => setCursor('ew-resize') }
        onMouseLeave={ () => setCursor('default') }
      />
    </Group>
  )
}

Item.contextTypes = {
  range: PropTypes.object,
  width: PropTypes.number,
  calcPosition: PropTypes.func,
  closestLayerY: PropTypes.func,
  setCursor: PropTypes.func,
}

export default Item
