import React from 'react'
import PropTypes from 'prop-types'
import { length } from 'stringz'

/**
 * Renders a character counter
 * @param {string} props.text - text to use to measure
 * @param {number} props.max - max text allowed
 */
class CharacterCounter extends React.PureComponent {

  render() {
    const { text, max } = this.props

    const actualRadius = 10
    const radius = 8
    const circumference = 2 * Math.PI * radius
    const diff = Math.min(length(text), max) / max
    const dashoffset = circumference * (1 - diff)
    const circleClass = length(text) > max ? _s.strokeError : _s.strokeBrand

    return (
      <div className={[_s.d, _s.mr10, _s.jcCenter, _s.aiCenter].join(' ')}>
        <svg
          width={actualRadius * 2}
          height={actualRadius * 2}
          viewBox={`0 0 ${actualRadius * 2} ${actualRadius * 2}`}
        >
          <circle
            fill='none'
            cx={actualRadius}
            cy={actualRadius}
            r={radius}
            fill='none'
            strokeWidth='2'
            className={_s.strokeSecondary}
          />
          <circle
            style={{
              strokeDashoffset: dashoffset,
              strokeDasharray: circumference,
            }}
            fill='none'
            cx={actualRadius}
            cy={actualRadius}
            r={radius}
            strokeWidth='2.25'
            strokeLinecap='round'
            className={circleClass}
          />
        </svg>
      </div>
    )
  }

}

CharacterCounter.propTypes = {
  text: PropTypes.string.isRequired,
  max: PropTypes.number.isRequired,
}

export default CharacterCounter