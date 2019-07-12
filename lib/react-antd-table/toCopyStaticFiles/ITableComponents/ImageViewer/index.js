import React, { useState, Fragment } from 'react'
import { Modal } from 'antd'
import styles from './index.less';

export default (props) => {
  const { src } = props
  const [visible, setVisible] = useState(false)
  const modalProps = {
    visible,
    onCancel: () => setVisible(false),
    footer: null
  }

  return (
    <Fragment>
      <img className={styles.img} src={src} onClick={() => setVisible(true)} alt="preview" />
      <Modal {...modalProps}>
        <img className={styles.modalImg} src={src} alt="preview" />
      </Modal>
    </Fragment>
  );
}
