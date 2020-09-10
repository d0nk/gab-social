import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { openSidebar } from '../../actions/sidebar'
import { openPopover } from '../../actions/popover'
import { BREAKPOINT_EXTRA_SMALL } from '../../constants'
import { me } from '../../initial_state'
import { makeGetAccount } from '../../selectors'
import Responsive from '../../features/ui/util/responsive_component'
import {
  CX,
  POPOVER_NAV_SETTINGS,
} from '../../constants'
import Avatar from '../avatar'
import BackButton from '../back_button'
import Button from '../button'
import Heading from '../heading'
import Icon from '../icon'
import NavigationBarButton from '../navigation_bar_button'
import Search from '../search'
import Text from '../text'

class DefaultNavigationBar extends ImmutablePureComponent {

  handleOnOpenNavSettingsPopover = () => {
    this.props.onOpenNavSettingsPopover(this.avatarNode)
  }

  setAvatarNode = (c) => {
    this.avatarNode = c
  }

  render() {
    const {
      title,
      showBackBtn,
      actions,
      tabs,
      account,
      onOpenSidebar,
      noActions,
      noSearch,
    } = this.props

    return (
      <div className={[_s.d, _s.z4, _s.minH53PX, _s.w100PC].join(' ')}>
        <div className={[_s.d, _s.minH53PX, _s.bgNavigation, _s.aiCenter, _s.z3, _s.top0, _s.right0, _s.left0, _s.posFixed].join(' ')} >

          <div className={[_s.d, _s.saveAreaInsetPT, _s.saveAreaInsetPL, _s.saveAreaInsetPR, _s.flexRow, _s.w1255PX].join(' ')}>

            { /** Default */}
            <Responsive min={BREAKPOINT_EXTRA_SMALL}>

              <div className={[_s.d, _s.flexRow].join(' ')}>

                <h1 className={[_s.d, _s.mr15].join(' ')}>
                  <Button
                    to='/'
                    isText
                    title='Gab'
                    aria-label='Gab'
                    color='none'
                    backgroundColor='none'
                    className={[_s.d, _s.jcCenter, _s.noSelect, _s.noUnderline, _s.h53PX, _s.cursorPointer, _s.px10, _s.mr15].join(' ')}
                  >
                    <Icon id='logo' className={_s.fillNavigationBrand} />
                  </Button>
                </h1>

                {
                  !noSearch &&
                  <div className={[_s.d, _s.w340PX, _s.mr10].join(' ')}>
                    <Search isInNav />
                  </div>
                }

              </div>

              <div className={[_s.d, _s.mlAuto].join(' ')}>
                {
                  !noActions &&
                  <div className={[_s.d, _s.h53PX, _s.pl15, _s.flexRow, _s.aiCenter, _s.jcSpaceBetween].join(' ')}>

                    <NavigationBarButton title='Home' icon='home' to='/home' />
                    <NavigationBarButton title='Explore' icon='explore' to='/explore' />
                    <NavigationBarButton title='News' icon='news' to='/news' />
                    <NavigationBarButton title='TV' icon='gab-tv' href='https://tv.gab.com' />

                    <div className={[_s.d, _s.h20PX, _s.w1PX, _s.mr10, _s.ml10, _s.bgNavigationBlend].join(' ')} />

                    <NavigationBarButton attrTitle='Notifications' icon='notifications' to='/notifications' />
                    <NavigationBarButton attrTitle='Settings' icon='cog' href='/settings/preferences' />

                    <div className={[_s.d, _s.h20PX, _s.w1PX, _s.mr10, _s.ml10, _s.bgNavigationBlend].join(' ')} />
                  
                    {
                      !!account &&
                      <button
                        ref={this.setAvatarNode}
                        title={account.get('display_name')}
                        onClick={this.handleOnOpenNavSettingsPopover}
                        className={[_s.h53PX, _s.bgTransparent, _s.outlineNone, _s.cursorPointer, _s.d, _s.jcCenter, _s.ml15].join(' ')}
                      >
                        <Avatar account={account} size={32} noHover />
                      </button>
                    }
                  </div>
                }
              </div>

            </Responsive>
            
            { /** Mobile */}
            <Responsive max={BREAKPOINT_EXTRA_SMALL}>
              <div className={[_s.d, _s.w84PX, _s.aiStart, _s.pl10].join(' ')}>
                {
                  !!account && !showBackBtn && !noActions &&
                  <button
                    title={account.get('display_name')}
                    onClick={onOpenSidebar}
                    className={[_s.h53PX, _s.bgTransparent, _s.outlineNone, _s.cursorPointer, _s.d, _s.jcCenter].join(' ')}
                  >
                    <Avatar account={account} size={32} noHover />
                  </button>
                }
                {
                  showBackBtn &&
                  <BackButton
                    className={_s.h53PX}
                    icon='angle-left'
                    iconSize='18px'
                    iconClassName={[_s.mr5, _s.fillNavigation].join(' ')}
                  />
                }
                {
                  noActions &&
                  <h1 className={[_s.d, _s.mr15].join(' ')}>
                    <Button
                      to='/'
                      isText
                      title='Gab'
                      aria-label='Gab'
                      color='none'
                      backgroundColor='none'
                      className={[_s.d, _s.jcCenter, _s.noSelect, _s.noUnderline, _s.h53PX, _s.cursorPointer, _s.px10, _s.mr15].join(' ')}
                    >
                      <Icon id='logo' className={_s.fillNavigationBrand} />
                    </Button>
                  </h1>
                }
              </div>
              
              <div className={[_s.d, _s.h53PX, _s.jcCenter, _s.mlAuto, _s.mrAuto].join(' ')}>
                <Heading size='h1'>
                  <span className={_s.colorNavigation}>
                    {title}
                  </span>
                </Heading>
              </div>

              <div className={[_s.d, _s.w84PX, _s.pr15].join(' ')}>
                <div className={[_s.d, _s.bgTransparent, _s.flexRow, _s.aiCenter, _s.jcCenter, _s.mlAuto].join(' ')}>
                  {
                    actions && actions.map((action, i) => (
                      <Button
                        isNarrow
                        backgroundColor='none'
                        color='primary'
                        to={action.to || undefined}
                        onClick={action.onClick ? () => action.onClick() : undefined}
                        key={`action-btn-${i}`}
                        className={[_s.ml5, _s.h53PX, _s.jcCenter, _s.px5].join(' ')}
                        icon={action.icon}
                        iconClassName={_s.fillNavigation}
                        iconSize='18px'
                      />
                    ))
                  }
                  {
                    !noSearch &&
                    <Button
                      isNarrow
                      backgroundColor='none'
                      color='primary'
                      to='/search'
                      key={`action-btn-search`}
                      className={[_s.ml5, _s.h53PX, _s.jcCenter, _s.px5].join(' ')}
                      icon='search'
                      iconClassName={_s.fillNavigation}
                      iconSize='18px'
                    />
                  }
                </div>
              </div>
              
            </Responsive>

          </div>

        </div>
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  account: makeGetAccount()(state, me),
})

const mapDispatchToProps = (dispatch) => ({
  onOpenSidebar() {
    dispatch(openSidebar())
  },

  onOpenNavSettingsPopover(targetRef) {
    dispatch(openPopover(POPOVER_NAV_SETTINGS, {
      targetRef,
      position: 'left-end',
    }))
  }
})

DefaultNavigationBar.propTypes = {
  account: ImmutablePropTypes.map,
  actions: PropTypes.array,
  tabs: PropTypes.array,
  title: PropTypes.string,
  showBackBtn: PropTypes.bool,
  onOpenSidebar: PropTypes.func.isRequired,
  onOpenNavSettingsPopover: PropTypes.func.isRequired,
  noActions: PropTypes.bool,
  noSearch: PropTypes.bool,
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultNavigationBar)