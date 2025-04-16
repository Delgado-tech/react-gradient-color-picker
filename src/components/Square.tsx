import { computePickerPosition, computeSquareXY } from '../utils/utils.js'
import React, { useRef, useState, useEffect } from 'react'
import usePaintSquare from '../hooks/usePaintSquare.js'
import { usePicker } from '../context.js'
import tinycolor from 'tinycolor2'

const Square = () => {
  const {
    hc,
    config,
    squareWidth,
    squareHeight,
    handleChange,
    defaultStyles,
    pickerIdSuffix,
  } = usePicker()
  const { crossSize } = config
  const [dragging, setDragging] = useState(false)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [x, y] = computeSquareXY(
    hc?.s,
    hc?.v * 100,
    squareWidth,
    squareHeight,
    crossSize
  )
  const [dragPos, setDragPos] = useState({ x, y })
  const squareRef = useRef<HTMLDivElement>(null)

  usePaintSquare(canvas, hc?.h, squareWidth, squareHeight)

  useEffect(() => {
    if (!dragging) {
      setDragPos({ x: hc?.v === 0 ? dragPos.x : x, y })
    }
  }, [x, y])

  useEffect(() => {
    const handleUp = () => {
      stopDragging()
    }

    window.addEventListener('mouseup', handleUp)
    window.addEventListener('mousemove', handleMove)

    return () => {
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('mousemove', handleMove)
    }
  }, [dragging])

  useEffect(() => {
    if (dragging) {
      handleColor()
    }
  }, [dragPos.x, dragPos.y, dragging])

  const handleColor = () => {
    const { x, y } = dragPos

    if (x && y) {
      const x1 = Math.min(x + crossSize / 2.2, squareWidth)
      const y1 = Math.min(y + crossSize / 2.2, squareHeight)
      const newS = (x1 / squareWidth) * 100
      const newY = 100 - (y1 / squareHeight) * 100
      const updated = tinycolor(`hsva(${hc?.h}, ${newS}%, ${newY}%, ${hc?.a})`)
      handleChange(updated.toRgbString())
    }
  }

  const setComputedDragPos = (e: any) => {
    if (squareRef.current) {
      const [x, y] = computePickerPosition(e, squareRef.current, crossSize)
      setDragPos({ x, y })
    }
  }

  const stopDragging = () => {
    setDragging(false)
  }

  const handleMove = (e: any) => {
    if (dragging) {
      setComputedDragPos(e)
    }
  }

  const handleClick = (e: any) => {
    if (!dragging) {
      setComputedDragPos(e)
    }
  }

  const handleMouseDown = () => {
    setDragging(true)
  }

  const handleCanvasDown = (e: any) => {
    setDragging(true)
    setComputedDragPos(e)
  }

  return (
    <div
      style={{ position: 'relative', marginBottom: 12 }}
      id={`rbgcp-square-wrapper${pickerIdSuffix}`}
    >
      <div
        onMouseUp={stopDragging}
        onTouchEnd={stopDragging}
        onMouseDown={handleCanvasDown}
        onTouchStart={handleCanvasDown}
        id={`rbgcp-square${pickerIdSuffix}`}
        ref={squareRef}
        style={{ position: 'relative', cursor: 'ew-cross' }}
      >
        <div
          style={{
            ...defaultStyles.rbgcpHandle,
            transform: `translate(${dragPos?.x ?? 0}px, ${dragPos?.y ?? 0}px)`,
            ...(dragging ? { transition: '' } : {}),
          }}
          onMouseDown={handleMouseDown}
          id={`rbgcp-square-handle${pickerIdSuffix}`}
        />
        <div
          style={{ ...defaultStyles.rbgcpCanvasWrapper, height: squareHeight }}
          id={`rbgcp-square-canvas-wrapper${pickerIdSuffix}`}
          onClick={(e) => handleClick(e)}
        >
          <canvas
            ref={canvas}
            width={`${squareWidth}px`}
            height={`${squareHeight}px`}
            id={`rbgcp-square-canvas${pickerIdSuffix}`}
          />
        </div>
      </div>
    </div>
  )
}

export default Square
