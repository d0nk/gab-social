import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { List as ImmutableList } from 'immutable'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { expandGabTrendsFeed } from '../../actions/news'
import {
  CX,
  BREAKPOINT_EXTRA_SMALL,
} from '../../constants'
import { getWindowDimension } from '../../utils/is_mobile'
import PanelLayout from './panel_layout'
import TrendsCard from '../trends_card'
import Button from '../button'
import LoadMore from '../load_more'
import ScrollableList from '../scrollable_list'

const initialState = getWindowDimension()

class TrendsRSSPanel extends ImmutablePureComponent {

  state = {
    viewType: 0,
    fetched: false,
    isXS: initialState.width <= BREAKPOINT_EXTRA_SMALL,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.shouldLoad && !prevState.fetched) {
      return { fetched: true }
    }

    return null
  }

  componentDidUpdate(prevProps, prevState) {
    if ((!prevState.fetched && this.state.fetched && this.props.isLazy) ||
        ((prevProps.trendsRSSId !== this.props.trendsRSSId) && !!prevProps.trendsRSSId)) {
      this.handleOnExpand()
    }
  }

  componentDidMount() {
    if (!this.props.isLazy) {
      this.handleOnExpand()
      this.setState({ fetched: true })
    }

    this.handleResize()
    window.addEventListener('keyup', this.handleKeyUp, false)
    window.addEventListener('resize', this.handleResize, false)
  }

  handleResize = () => {
    const { width } = getWindowDimension()

    this.setState({ isXS: width <= BREAKPOINT_EXTRA_SMALL })
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp)
    window.removeEventListener('resize', this.handleResize, false)
  }

  onItemViewClick = () => {
    this.setState({ viewType: this.state.viewType === 0 ? 1 : 0 })
  }

  handleOnExpand = () => {
    this.props.dispatch(expandGabTrendsFeed(this.props.trendsRSSId))
  }

  render() {
    const {
      trendsRSSId,
      isLoading,
      isFetched,
      items,
      hideReadMore,
      feed,
    } = this.props
    const {
      fetched,
      viewType,
      isXS,
    } = this.state

    const count = !!items ? items.count() : 0
    if (count === 0 && fetched) return null
    const hasMore = count % 10 === 0

    const containerClasses = CX({
      d: 1,
      w100PC: 1,
      flexRow: viewType === 1,
      flexWrap: viewType === 1,
    })

    return (
      <div className={[_s.d, _s.w100PC].join(' ')}>
        <div className={containerClasses} >
          <ScrollableList
            scrollKey={`trends-rss-panel-${trendsRSSId}`}
            onLoadMore={this.handleOnExpand}
            hasMore={hasMore}
            isLoading={isLoading}
            emptyMessage='No feed items found.'
            disableInfiniteScroll
          >
          {
            items.map((trend, i) => (
              <TrendsCard
                isXS={isXS}
                trend={trend}
                viewType={viewType}
                key={`trend-card-rss-${i}`}
              />
            ))
          }
          </ScrollableList>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, { trendsRSSId }) => ({
  isLoading: state.getIn(['news', 'trends_feeds', `${trendsRSSId}`, 'isLoading'], false),
  isFetched: state.getIn(['news', 'trends_feeds', `${trendsRSSId}`, 'isFetched'], false),
  items: state.getIn(['news', 'trends_feeds', `${trendsRSSId}`, 'items'], ImmutableList()),
})

TrendsRSSPanel.propTypes = {
  isLazy: PropTypes.bool,
  isLoading: PropTypes.bool,
  isFetched: PropTypes.bool,
  trendsRSSId: PropTypes.string.isRequired,
  items: ImmutablePropTypes.list,
  isPage: PropTypes.bool,
}

export default connect(mapStateToProps)(TrendsRSSPanel)