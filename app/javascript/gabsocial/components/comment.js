import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import {
  favorite,
  unfavorite,
  repost,
  unrepost,
} from '../actions/interactions'
import { replyCompose } from '../actions/compose'
import { openModal } from '../actions/modal'
import { openPopover } from '../actions/popover'
import { makeGetStatus } from '../selectors'
import {
  CX,
  MODAL_BOOST,
} from '../constants'
import { me, boostModal } from '../initial_state'
import Avatar from './avatar'
import Button from './button'
import CommentHeader from './comment_header'
import StatusContent from './status_content'
import StatusMedia from './status_media'
import { defaultMediaVisibility } from './status'
import Text from './text'

class Comment extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  state = {
    showMedia: defaultMediaVisibility(this.props.status),
    statusId: undefined,
    height: undefined,
  }

  handleClick = () => {
    //
  }

  handleOnReply = () => {
    this.props.onReply(this.props.status, this.context.router)
  }

  handleOnFavorite = () => {
    this.props.onFavorite(this.props.status)
  }

  handleOnRepost = () => {
    this.props.onRepost(this.props.status)
  }

  handleOnOpenStatusOptions = () => {
    this.props.onOpenStatusOptions(this.moreNode, this.props.status)
  }

  handleToggleMediaVisibility = () => {
    this.setState({ showMedia: !this.state.showMedia })
  }

  handleOnThreadMouseEnter = (event) => {
    if (event.target) {
      const threadKey = event.target.getAttribute('data-threader-indent')
      const elems = document.querySelectorAll(`[data-threader-indent="${threadKey}"]`)
      elems.forEach((elem) => elem.classList.add('thread-hovering'))
    }
  }
  
  handleOnThreadMouseLeave = (event) => {
    if (event.target) {
      const threadKey = event.target.getAttribute('data-threader-indent')
      const elems = document.querySelectorAll(`[data-threader-indent="${threadKey}"]`)
      elems.forEach((elem) => elem.classList.remove('thread-hovering'))
    }
  }
  
  handleOnThreadClick = (event) => {
    // : todo :
  }

  setMoreNode = (c) => {
    this.moreNode = c
  }

  render() {
    const {
      indent,
      intl,
      status,
      isHidden,
      isHighlighted,
      isDetached,
      ancestorAccountId,
    } = this.props

    if (isHidden) {
      return (
        <div tabIndex='0'>
          {status.getIn(['account', 'display_name']) || status.getIn(['account', 'username'])}
          {status.get('content')}
        </div>
      )
    }

    const style = {
      paddingLeft: `${indent * 38}px`,
    }

    const containerClasses = CX({
      d: 1,
      px15: 1,
      py5: !isDetached,
      pt10: isDetached,
      pb5: isDetached,
      borderBottom1PX: isDetached,
      borderColorSecondary: isDetached,
    })

    const contentClasses = CX({
      d: 1,
      px10: 1,
      pt5: 1,
      pb10: 1,
      radiusSmall: 1,
      bgSubtle: !isHighlighted,
      highlightedComment: isHighlighted,
    })

    return (
      <div className={containerClasses} data-comment={status.get('id')}>
        {
          indent > 0 &&
          <div className={[_s.d, _s.z3, _s.flexRow, _s.posAbs, _s.topNeg20PX, _s.left0, _s.bottom20PX, _s.aiCenter, _s.jcCenter].join(' ')}>
            {Array.apply(null, {
              length: indent
            }).map((_, i) => (
              <button
                key={`thread-${status.get('id')}-${i}`}
                data-threader
                data-threader-indent={i}
                onMouseEnter={this.handleOnThreadMouseEnter}
                onMouseLeave={this.handleOnThreadMouseLeave}
                onClick={this.handleOnThreadClick}
                className={[_s.d, _s.w14PX, _s.h100PC, _s.outlineNone, _s.bgTransparent, _s.ml20, _s.cursorPointer].join(' ')}
              >
                <span className={[_s.d, _s.w2PX, _s.h100PC, _s.mlAuto, _s.mr2, _s.bgSubtle].join(' ')} />
              </button>
            ))}
          </div>
        }
        <div className={[_s.d, _s.mb10].join(' ')} style={style}>

          <div className={[_s.d, _s.flexRow].join(' ')}>
            <NavLink
              to={`/${status.getIn(['account', 'acct'])}`}
              title={status.getIn(['account', 'acct'])}
              className={[_s.d, _s.mr10, _s.pt5].join(' ')}
            >
              <Avatar account={status.get('account')} size={30} />
            </NavLink>

            <div className={[_s.d, _s.flexShrink1, _s.maxW100PC42PX].join(' ')}>
              <div className={contentClasses}>
                <CommentHeader
                  ancestorAccountId={ancestorAccountId}
                  status={status}
                  onOpenRevisions={this.props.onOpenStatusRevisionsPopover}
                  onOpenLikes={this.props.onOpenLikes}
                  onOpenReposts={this.props.onOpenReposts}
                />
                <StatusContent
                  status={status}
                  onClick={this.handleClick}
                  isComment
                  collapsable
                />
                <div className={[_s.d, _s.mt5].join(' ')}>
                  <StatusMedia
                    isComment
                    status={status}
                    onOpenMedia={this.props.onOpenMedia}
                    cacheWidth={this.props.cacheMediaWidth}
                    defaultWidth={this.props.cachedMediaWidth}
                    visible={this.state.showMedia}
                    onToggleVisibility={this.handleToggleMediaVisibility}
                    width={this.props.cachedMediaWidth}
                  />
                </div>
              </div>

              <div className={[_s.d, _s.flexRow, _s.mt5].join(' ')}>
                <CommentButton
                  title={intl.formatMessage(status.get('favourited') ? messages.unlike : messages.like)}
                  onClick={this.handleOnFavorite}
                />
                <CommentButton
                  title={intl.formatMessage(messages.reply)}
                  onClick={this.handleOnReply}
                />
                <CommentButton
                  title={intl.formatMessage(status.get('reblogged') ? messages.unrepost : messages.repost)}
                  onClick={this.handleOnRepost}
                />
                <div ref={this.setMoreNode}>
                  <CommentButton
                    title='···'
                    onClick={this.handleOnOpenStatusOptions}
                  />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    )
  }

}

class CommentButton extends React.PureComponent {

  render() {
    const { onClick, title } = this.props

    return (
      <Button
        isText
        radiusSmall
        backgroundColor='none'
        color='tertiary'
        className={[_s.px5, _s.bgSubtle_onHover, _s.py2, _s.mr5].join(' ')}
        onClick={onClick}
      >
        <Text size='extraSmall' color='inherit' weight='bold'>
          {title}
        </Text>
      </Button>
    )
  }

}

CommentButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}

const messages = defineMessages({
  reply: { id: 'status.reply', defaultMessage: 'Reply' },
  repost: { id: 'status.repost', defaultMessage: 'Repost' },
  unrepost: { id: 'status.unrepost', defaultMessage: 'Unrepost' },
  like: { id: 'status.like', defaultMessage: 'Like' },
  unlike: { id: 'status.unlike', defaultMessage: 'Unlike' },
})

const makeMapStateToProps = (state, props) => ({
  status: makeGetStatus()(state, props)
})

const mapDispatchToProps = (dispatch) => ({
  onReply(status, router) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    dispatch((_, getState) => {
      const state = getState();
      if (state.getIn(['compose', 'text']).trim().length !== 0) {
        dispatch(openModal('CONFIRM', {
          message: <FormattedMessage id='confirmations.reply.message' defaultMessage='Replying now will overwrite the message you are currently composing. Are you sure you want to proceed?' />,
          confirm: <FormattedMessage id='confirmations.reply.confirm' defaultMessage='Reply' />,
          onConfirm: () => dispatch(replyCompose(status, router)),
        }))
      } else {
        dispatch(replyCompose(status, router, true))
      }
    })
  },
  onFavorite(status) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    if (status.get('favourited')) {
      dispatch(unfavorite(status))
    } else {
      dispatch(favorite(status))
    }
  },
  onRepost(status) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    const alreadyReposted = status.get('reblogged')

    if (boostModal && !alreadyReposted) {
      dispatch(openModal(MODAL_BOOST, {
        status,
        onRepost: () => dispatch(repost(status)),
      }))
    } else {
      if (alreadyReposted) {
        dispatch(unrepost(status))
      } else {
        dispatch(repost(status))
      }
    }
  },
  onOpenStatusOptions(targetRef, status) {
    dispatch(openPopover('STATUS_OPTIONS', {
      targetRef,
      statusId: status.get('id'),
      position: 'top',
    }))
  },
  onOpenLikes(status) {
    dispatch(openModal('STATUS_LIKES', { status }))
  },
  onOpenReposts(status) {
    dispatch(openModal('STATUS_REPOSTS', { status }))
  },
  onOpenStatusRevisionsPopover(status) {
    dispatch(openModal('STATUS_REVISIONS', {
      status,
    }))
  },
  onOpenMedia (media, index) {
    dispatch(openModal('MEDIA', { media, index }));
  },
})

Comment.propTypes = {
  indent: PropTypes.number,
  intl: PropTypes.object.isRequired,
  ancestorAccountId: PropTypes.string.isRequired,
  status: ImmutablePropTypes.map.isRequired,
  isHidden: PropTypes.bool,
  isDetached: PropTypes.bool,
  isIntersecting: PropTypes.bool,
  isHighlighted: PropTypes.bool,
  onReply: PropTypes.func.isRequired,
  onFavorite: PropTypes.func.isRequired,
  onRepost: PropTypes.func.isRequired,
  onOpenStatusOptions: PropTypes.func.isRequired,
  onOpenLikes: PropTypes.func.isRequired,
  onOpenReposts: PropTypes.func.isRequired,
  onOpenStatusRevisionsPopover: PropTypes.func.isRequired,
  onOpenMedia: PropTypes.func.isRequired
}

export default injectIntl(connect(makeMapStateToProps, mapDispatchToProps)(Comment))