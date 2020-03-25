const GroupAddIcon = ({
  className = '',
  width = '24px',
  height = '24px',
  viewBox = '0 0 64 64',
  title = 'Group Add',
}) => (
  <svg
    className={className}
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    x='0px'
    y='0px'
    width={width}
    height={height}
    viewBox={viewBox}
    xmlSpace='preserve'
    aria-label={title}
  >
    <g>
      <path d="M 64 53.5 L 53.5 53.5 L 53.5 64 L 48.5 64 L 48.5 53.5 L 38 53.5 L 38 48.5 L 48.5 48.5 L 48.5 38 L 53.5 38 L 53.5 48.5 L 64 48.5 Z M 37.414062 27.929688 C 37.632812 28.917969 37.75 29.945312 37.75 31 C 37.75 35.320312 35.800781 39.191406 32.738281 41.785156 C 32.824219 41.820312 32.914062 41.851562 33 41.886719 L 33 47.414062 C 30.324219 45.953125 27.257812 45.125 24 45.125 L 24 45.121094 C 23.957031 45.121094 23.917969 45.121094 23.875 45.121094 L 23.875 45.125 C 13.46875 45.125 5 53.59375 5 64 L 0 64 C 0 54.078125 6.085938 45.550781 14.714844 41.953125 C 11.535156 39.359375 9.5 35.414062 9.5 31 C 9.5 23.210938 15.835938 16.875 23.625 16.875 C 24.550781 16.875 25.457031 16.964844 26.332031 17.136719 C 26.117188 16.15625 26 15.136719 26 14.09375 C 26 6.320312 32.324219 0 40.09375 0 C 47.863281 0 54.1875 6.320312 54.1875 14.09375 C 54.1875 18.453125 52.195312 22.359375 49.074219 24.945312 C 53.199219 26.585938 56.757812 29.335938 59.359375 32.875 L 52.628906 32.875 C 49.523438 30.121094 45.507812 28.375 41.097656 28.148438 C 40.765625 28.171875 40.429688 28.1875 40.09375 28.1875 C 39.175781 28.1875 38.28125 28.097656 37.414062 27.929688 Z M 31 14.09375 C 31 19.109375 35.078125 23.1875 40.09375 23.1875 C 45.105469 23.1875 49.1875 19.109375 49.1875 14.09375 C 49.1875 9.078125 45.105469 5 40.09375 5 C 35.078125 5 31 9.078125 31 14.09375 Z M 32.75 31 C 32.75 25.96875 28.65625 21.875 23.625 21.875 C 18.59375 21.875 14.5 25.96875 14.5 31 C 14.5 36.03125 18.59375 40.125 23.625 40.125 C 28.65625 40.125 32.75 36.03125 32.75 31 Z M 32.75 31" />
    </g>
  </svg>
)

export default GroupAddIcon