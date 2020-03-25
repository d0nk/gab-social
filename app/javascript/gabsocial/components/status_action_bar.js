import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import classNames from 'classnames/bind'
import { openModal } from '../actions/modal'
import { openPopover } from '../actions/popover'
import { me } from '../initial_state'
import Text from './text'
import StatusActionBarItem from './status_action_bar_item'

const messages = defineMessages({
  delete: { id: 'status.delete', defaultMessage: 'Delete' },
  edit: { id: 'status.edit', defaultMessage: 'Edit' },
  mention: { id: 'status.mention', defaultMessage: 'Mention @{name}' },
  mute: { id: 'account.mute', defaultMessage: 'Mute @{name}' },
  block: { id: 'account.block', defaultMessage: 'Block @{name}' },
  reply: { id: 'status.reply', defaultMessage: 'Reply' },
  comment: { id: 'status.comment', defaultMessage: 'Comment' },
  more: { id: 'status.more', defaultMessage: 'More' },
  share: { id: 'status.share', defaultMessage: 'Share' },
  replyAll: { id: 'status.replyAll', defaultMessage: 'Reply to thread' },
  repost: { id: 'repost', defaultMessage: 'Repost' },
  quote: { id: 'status.quote', defaultMessage: 'Quote' },
  repost_private: { id: 'status.repost_private', defaultMessage: 'Repost to original audience' },
  cancel_repost_private: { id: 'status.cancel_repost_private', defaultMessage: 'Un-repost' },
  cannot_repost: { id: 'status.cannot_repost', defaultMessage: 'This post cannot be reposted' },
  cannot_quote: { id: 'status.cannot_quote', defaultMessage: 'This post cannot be quoted' },
  like: { id: 'status.like', defaultMessage: 'Like' },
  open: { id: 'status.open', defaultMessage: 'Expand this status' },
  report: { id: 'status.report', defaultMessage: 'Report @{name}' },
  muteConversation: { id: 'status.mute_conversation', defaultMessage: 'Mute conversation' },
  unmuteConversation: { id: 'status.unmute_conversation', defaultMessage: 'Unmute conversation' },
  pin: { id: 'status.pin', defaultMessage: 'Pin on profile' },
  unpin: { id: 'status.unpin', defaultMessage: 'Unpin from profile' },
  embed: { id: 'status.embed', defaultMessage: 'Embed' },
  admin_account: { id: 'status.admin_account', defaultMessage: 'Open moderation interface for @{name}' },
  admin_status: { id: 'status.admin_status', defaultMessage: 'Open this status in the moderation interface' },
  copy: { id: 'status.copy', defaultMessage: 'Copy link to status' },
  group_remove_account: { id: 'status.remove_account_from_group', defaultMessage: 'Remove account from group' },
  group_remove_post: { id: 'status.remove_post_from_group', defaultMessage: 'Remove status from group' },
})

const mapDispatchToProps = (dispatch) => ({
  onOpenUnauthorizedModal() {
    dispatch(openModal('UNAUTHORIZED'))
  },
  onOpenStatusSharePopover(targetRef, status) {
    console.log("targetRef, status:", targetRef, status)
    dispatch(openPopover('STATUS_SHARE', {
      status,
      targetRef,
      position: 'top',
    }))
  },
})

const cx = classNames.bind(_s)

export default
@connect(null, mapDispatchToProps)
@injectIntl
class StatusActionBar extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    onOpenUnauthorizedModal: PropTypes.func.isRequired,
    onOpenStatusSharePopover: PropTypes.func.isRequired,
    onReply: PropTypes.func,
    onQuote: PropTypes.func,
    onFavorite: PropTypes.func,
    onRepost: PropTypes.func,
    onDelete: PropTypes.func,
    onMention: PropTypes.func,
    onMute: PropTypes.func,
    onBlock: PropTypes.func,
    onReport: PropTypes.func,
    onEmbed: PropTypes.func,
    onMuteConversation: PropTypes.func,
    onPin: PropTypes.func,
    withDismiss: PropTypes.bool,
    withGroupAdmin: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  }

  // Avoid checking props that are functions (and whose equality will always
  // evaluate to false. See react-immutable-pure-component for usage.
  updateOnProps = [
    'status',
    'withDismiss',
  ]

  handleReplyClick = () => {
    if (me) {
      this.props.onReply(this.props.status, this.context.router.history)
    } else {
      this.props.onOpenUnauthorizedModal()
    }
  }

  handleQuoteClick = () => {
    if (me) {
      this.props.onQuote(this.props.status, this.context.router.history)
    } else {
      this.props.onOpenUnauthorizedModal()
    }
  }

  handleFavoriteClick = () => {
    if (me) {
      this.props.onFavorite(this.props.status)
    } else {
      this.props.onOpenUnauthorizedModal()
    }
  }

  handleRepostClick = e => {
    if (me) {
      this.props.onRepost(this.props.status, e)
    } else {
      this.props.onOpenUnauthorizedModal()
    }
  }

  handleShareClick = () => {
    console.log("handleShareClick:", this.shareButton, this.props.status)
    this.props.onOpenStatusSharePopover(this.shareButton, this.props.status)
  }

  setShareButton = (n) => {
    this.shareButton = n
  }

  render() {
    const { status, intl: { formatMessage } } = this.props

    const publicStatus = ['public', 'unlisted'].includes(status.get('visibility'))

    const replyCount = status.get('replies_count')
    const replyIcon = (status.get('in_reply_to_id', null) === null) ? 'reply' : 'reply-all'
    const replyTitle = (status.get('in_reply_to_id', null) === null) ? formatMessage(messages.reply) : formatMessage(messages.replyAll)

    const repostCount = status.get('reblogs_count')
    const repostTitle = !publicStatus ? formatMessage(messages.cannot_repost) : formatMessage(messages.repost)

    const favoriteCount = status.get('favourites_count') // : todo :

    const shareButton = ('share' in navigator) && status.get('visibility') === 'public' && (
      <IconButton className='status-action-bar-button' title={formatMessage(messages.share)} icon='share-alt' onClick={this.handleShareClick} />
    )

    const hasInteractions = favoriteCount > 0 || replyCount > 0 || repostCount > 0
    const shouldCondense = (!!status.get('card') || status.get('media_attachments').size > 0) && !hasInteractions

    const containerClasses = cx({
      default: 1,
      px10: 1,
      mt10: !shouldCondense,
      mt5: shouldCondense,
    })

    const innerContainerClasses = cx({
      default: 1,
      py2: 1,
      flexRow: 1,
      width100PC: 1,
      borderTop1PX: !shouldCondense,
      borderColorSecondary: !shouldCondense,
      mt5: hasInteractions,
    })

    const interactionBtnClasses = cx({
      default: 1,
      text: 1,
      cursorPointer: 1,
      fontWeightNormal: 1,
      mr10: 1,
      py5: 1,
    })

    return (
      <div className={containerClasses}>
        {
          hasInteractions &&
          <div className={[_s.default, _s.flexRow, _s.px5].join(' ')}>
            {
              favoriteCount > 0 &&
              <button className={interactionBtnClasses}>
                <Text color='secondary'>
                  {favoriteCount}
                  &nbsp;Likes
                </Text>
              </button>
            }
            {
              replyCount > 0 &&
              <button className={interactionBtnClasses}>
                <Text color='secondary'>
                  {replyCount}
                  &nbsp;Comments
                </Text>
              </button>
            }
            {
              repostCount > 0 &&
              <button className={interactionBtnClasses}>
                <Text color='secondary'>
                  {repostCount}
                  &nbsp;Reposts
                </Text>
              </button>
            }
          </div>
        }
        <div className={innerContainerClasses}>
          <div className={[_s.default, _s.flexRow, _s.py2, _s.width100PC].join(' ')}>
            <StatusActionBarItem
              title={formatMessage(messages.like)}
              icon='like'
              active={!!status.get('favorited')}
              onClick={this.handleFavoriteClick}
            />
            <StatusActionBarItem
              title={formatMessage(messages.comment)}
              icon='comment'
              onClick={this.handleReplyClick}
            />
            <StatusActionBarItem
              title={repostTitle}
              icon={(status.get('visibility') === 'private') ? 'lock' : 'repost'}
              disabled={!publicStatus}
              active={!!status.get('reblogged')}
              onClick={this.handleRepostClick}
            />
            <StatusActionBarItem
              buttonRef={this.setShareButton}
              title={formatMessage(messages.share)}
              icon='share'
              onClick={this.handleShareClick}
            />
          </div>
        </div>
      </div>
    )
  }

}
