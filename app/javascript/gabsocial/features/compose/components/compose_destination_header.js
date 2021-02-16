import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  CX,
  MODAL_COMPOSE,
  MAX_POST_CHARACTER_COUNT,
  POPOVER_COMPOSE_POST_DESTINATION,
} from '../../../constants'
import { openModal } from '../../../actions/modal'
import { openPopover } from '../../../actions/popover'
import Avatar from '../../../components/avatar'
import Button from '../../../components/button'
import Icon from '../../../components/icon'
import Text from '../../../components/text'
import CharacterCounter from '../../../components/character_counter'

class ComposeDestinationHeader extends ImmutablePureComponent {

  handleOnClick = () => {
    this.props.onOpenPopover(this.desinationBtn)
  }

  handleOnExpand = () => {
    this.props.onOpenModal()
  }

  setDestinationBtn = (c) => {
    this.desinationBtn = c
  }

  render() {
    const {
      account,
      isEdit,
      isReply,
      isModal,
      composeGroup,
      composeGroupId,
      formLocation,
      text,
    } = this.props

    const isIntroduction = formLocation === 'introduction'

    let editText = isEdit ? ' edit ' : ' '
    let groupTitle = !!composeGroup ? composeGroup.get('title') : ''
    groupTitle = groupTitle.length > 32 ? `${groupTitle.substring(0, 32).trim()}...` : groupTitle
    if (!groupTitle && composeGroupId) groupTitle = 'group'

    let title = `Post${editText}to timeline`
    if (!!composeGroupId) {
      if (isReply) {
        title = `Comment${editText}in ${groupTitle}`
      } else {
        title = `Post${editText}to ${groupTitle}`
      }
    } else {
      if (isReply) {
        title = `Post${editText}as comment`
      }
    }

    return (
      <div className={[_s.d, _s.flexRow, _s.aiCenter, _s.bgPrimary, _s.w100PC, _s.h40PX, _s.pr15].join(' ')}>
        <div className={[_s.d, _s.flexRow, _s.aiCenter, _s.pl15, _s.flexGrow1, _s.mrAuto, _s.h40PX].join(' ')}>
          <Avatar account={account} size={28} />
          {
            !isIntroduction &&
            <div className={[_s.ml15].join(' ')}>
              <Button
                isNarrow
                isOutline
                radiusSmall
                buttonRef={this.setDestinationBtn}
                backgroundColor='secondary'
                color='primary'
                onClick={(isReply || isEdit) ? undefined : this.handleOnClick}
                className={[_s.border1PX, _s.borderColorPrimary].join(' ')}
              >
                <Text color='inherit' size='small' className={_s.jcCenter}>
                  {title}
                  { !isReply && !isEdit && <Icon id='caret-down' size='8px' className={_s.ml5} /> }
                </Text>
              </Button>
            </div>
          }
        </div>
        {
          !!text &&
          <CharacterCounter max={MAX_POST_CHARACTER_COUNT} text={text} />
        }
        {
          !isModal && !isIntroduction &&
          <Button
            isText
            isNarrow
            backgroundColor='none'
            color='tertiary'
            icon='fullscreen'
            onClick={this.handleOnExpand}
            className={_s.ml10}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const composeGroupId = state.getIn(['compose', 'group_id'])

  return {
    composeGroupId,
    text: state.getIn(['compose', 'text']),
    isReply: !!state.getIn(['compose', 'in_reply_to']),
    isEdit: state.getIn(['compose', 'id']) !== null,
    composeGroup: state.getIn(['groups', composeGroupId]),
  }
}

const mapDispatchToProps = (dispatch) => ({
  onOpenModal() {
    dispatch(openModal(MODAL_COMPOSE))
  },
  onOpenPopover(targetRef) {
    dispatch(openPopover(POPOVER_COMPOSE_POST_DESTINATION, {
      targetRef,
      position: 'bottom',
    }))
  },
})

ComposeDestinationHeader.propTypes = {
  account: ImmutablePropTypes.map,
  isModal: PropTypes.bool,
  onOpenModal: PropTypes.func.isRequired,
  onOpenPopover: PropTypes.func.isRequired,
  formLocation: PropTypes.string,
  isReply: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(ComposeDestinationHeader)