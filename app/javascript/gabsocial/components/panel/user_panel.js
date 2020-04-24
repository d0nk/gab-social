import { NavLink } from 'react-router-dom'
import { injectIntl, defineMessages } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import classNames from 'classnames/bind'
import { me } from '../../initial_state'
import { makeGetAccount } from '../../selectors'
import { shortNumberFormat } from '../../utils/numbers'
import { openModal } from '../../actions/modal'
import Button from '../button'
import DisplayName from '../display_name'
import Avatar from '../avatar'
import Image from '../image'
import UserStat from '../user_stat'
import PanelLayout from './panel_layout'

const cx = classNames.bind(_s)

const messages = defineMessages({
  gabs: { id: 'account.posts', defaultMessage: 'Gabs' },
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  follows: { id: 'account.follows', defaultMessage: 'Follows' },
  edit_profile: { id: 'account.edit_profile', defaultMessage: 'Edit profile' },
  headerPhoto: { id: 'header_photo', defaultMessage: 'Header photo' },
})

const mapStateToProps = (state) => ({
  account: makeGetAccount()(state, me),
})

const mapDispatchToProps = (dispatch) => ({
  onOpenEditProfile() {
    dispatch(openModal('EDIT_PROFILE'))
  },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class UserPanel extends ImmutablePureComponent {
  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    intl: PropTypes.object.isRequired,
    onOpenEditProfile: PropTypes.func.isRequired,
  }

  state = {
    hovering: false,
  }

  updateOnProps = [
    'account'
  ]

  handleOnMouseEnter = () => {
    this.setState({ hovering: true })
  }

  handleOnMouseLeave = () => {
    this.setState({ hovering: false })
  }

  handleOnOpenEditProfile = () => {
    this.props.onOpenEditProfile()
  }

  render() {
    const { account, intl } = this.props
    const { hovering } = this.state

    const buttonClasses = cx({
      posAbs: 1,
      mt10: 1,
      mr10: 1,
      top0: 1,
      right0: 1,
      displayNone: !hovering,
    })

    const acct = account.get('acct')

    return (
      <PanelLayout noPadding>
        <div
          className={[_s.default, _s.height122PX].join(' ')}
          onMouseEnter={this.handleOnMouseEnter}
          onMouseLeave={this.handleOnMouseLeave}
        >
          <Image
            alt={intl.formatMessage(messages.headerPhoto)}
            className={_s.height122PX}
            src={account.get('header_static')}
          />
          <Button
            color='secondary'
            backgroundColor='secondary'
            radiusSmall
            className={buttonClasses}
            onClick={this.handleOnOpenEditProfile}
          >
            {intl.formatMessage(messages.edit_profile)}
          </Button>
        </div>

        <NavLink
          className={[_s.default, _s.flexRow, _s.py10, _s.px15, _s.noUnderline].join(' ')}
          to={`/${acct}`}
        >
          <div className={[_s.default, _s.mtNeg32PX, _s.circle, _s.borderColorWhite, _s.border6PX].join(' ')}>
            <Avatar account={account} size={62} noHover />
          </div>
          <div className={[_s.default, _s.ml15].join(' ')}>
            <DisplayName account={account} isMultiline noRelationship noHover />
          </div>
        </NavLink>

        <div className={[_s.default, _s.mb15, _s.mt5, _s.flexRow, _s.px15].join(' ')}>
          <UserStat
            to={`/${acct}`}
            title={intl.formatMessage(messages.gabs)}
            value={shortNumberFormat(account.get('statuses_count'))}
          />
          <UserStat
            to={`/${acct}/followers`}
            title={intl.formatMessage(messages.followers)}
            value={shortNumberFormat(account.get('followers_count'))}
          />
          <UserStat
            to={`/${acct}/following`}
            title={intl.formatMessage(messages.follows)}
            value={shortNumberFormat(account.get('following_count'))}
          />
        </div>
      </PanelLayout>
    )
  }
}