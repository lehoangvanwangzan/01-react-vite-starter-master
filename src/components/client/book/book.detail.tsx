import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Col, Divider, Rate, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import { BsCartPlus } from "react-icons/bs";
import ImageGallery from 'react-image-gallery';
import { ModalGallery } from "./modal.gallery";
import { useCurrentApp } from '@/components/context/app.context';
type UserAction = "MINUS" | "PLUS"
interface IProps {
    currentBook: IBookTable | null;
}
export const BookDetail = (props: IProps) => {
    const { message } = App.useApp();
    const { currentBook } = props;
    const { setCarts } = useCurrentApp();
    const [imageGallery, setImageGallery] = useState<{
        original: string;
        thumbnail: string;
        originalClass: string;
        thumbnailClass: string;
    }[]>([])
    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentQuantity, setCurrentQuantity] = useState<number>(1);
    const refGallery = useRef<ImageGallery>(null);
    useEffect(() => {
        if (currentBook) {
            //build images 
            const images = [];
            if (currentBook.thumbnail) {
                images.push(
                    {
                        original: `${import.meta.env.VITE_URL_BACKEND}/images/book/${currentBook.thumbnail}`,
                        thumbnail: `${import.meta.env.VITE_URL_BACKEND}/images/book/${currentBook.thumbnail}`,
                        originalClass: "original-image",
                        thumbnailClass: "thumbnail-image"
                    },
                )
            }
            if (currentBook.slider) {
                currentBook.slider?.map(item => {
                    images.push(
                        {
                            original: `${import.meta.env.VITE_URL_BACKEND}/images/book/${item}`,
                            thumbnail: `${import.meta.env.VITE_URL_BACKEND}/images/book/${item}`,
                            originalClass: "original-image",
                            thumbnailClass: "thumbnail-image"
                        },
                    )
                })
            }
            setImageGallery(images)
        }
    }, [currentBook])
    const handleOnClickImage = (index: number) => {

        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery.current?.getCurrentIndex() ?? 0);
    }
    const handleChangeButton = (type: UserAction) => {
        if (type === 'MINUS') {
            if (currentQuantity - 1 <= 0) return;
            setCurrentQuantity(currentQuantity - 1);
        }
        if (type === 'PLUS' && currentBook) {
            if (currentQuantity === +currentBook.quantity) return; //max
            setCurrentQuantity(currentQuantity + 1);
        }
    }

    const handleChangeInput = (value: string) => {
        if (!isNaN(+value)) {
            if (+value > 0 && currentBook && +value < +currentBook.quantity) {
                setCurrentQuantity(+value);
            }
        }
    }
    const handleAddToCart = () => {
        //update localStorage
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage && currentBook) {
            //update
            const carts = JSON.parse(cartStorage) as ICart[];

            //check exist
            let isExistIndex = carts.findIndex(c => c._id === currentBook?._id);
            if (isExistIndex > -1) {
                carts[isExistIndex].quantity =
                    carts[isExistIndex].quantity + currentQuantity;
            } else {
                carts.push({
                    quantity: currentQuantity,
                    _id: currentBook._id,
                    detail: currentBook
                })
            }

            localStorage.setItem("carts", JSON.stringify(carts));

            //sync React Context
            setCarts(carts);
        } else {
            //create
            const data = [{
                _id: currentBook?._id!,
                quantity: currentQuantity,
                detail: currentBook!
            }]
            localStorage.setItem("carts", JSON.stringify(data))

            //sync React Context
            setCarts(data);
        }
        message.success("Thêm sản phẩm vào giỏ hàng thành công.")
    }

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className='view-detail-book' style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
                <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                    <Row gutter={[20, 20]}>
                        <Col md={10} sm={0} xs={0}>
                            <ImageGallery
                                ref={refGallery}
                                items={imageGallery}
                                showPlayButton={false} //hide play button
                                showFullscreenButton={false} //hide fullscreen button
                                renderLeftNav={() => <></>} //left arrow === <> </>
                                renderRightNav={() => <></>}//right arrow === <> </>
                                slideOnThumbnailOver={true}  //onHover => auto scroll images
                                onClick={() => handleOnClickImage(0)} //onClick => open modal
                            />
                        </Col>
                        <Col md={14} sm={24}>
                            <Col md={0} sm={24} xs={24}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={imageGallery}
                                    showPlayButton={false} //hide play button
                                    showFullscreenButton={false} //hide fullscreen button
                                    renderLeftNav={() => <></>} //left arrow === <> </>
                                    renderRightNav={() => <></>}//right arrow === <> </>
                                    showThumbnails={false}
                                />
                            </Col>
                            <Col span={24}>
                                <div className='author'>Tác giả: <a href='#'>{currentBook?.author}</a> </div>
                                <div className='title'>{currentBook?.mainText}</div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                    <span className='sold'>
                                        <Divider type="vertical" />
                                        Đã bán {currentBook?.sold ?? 0}</span>
                                </div>
                                <div className='price'>
                                    <span className='currency'>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBook?.price ?? 0)}
                                    </span>
                                </div>
                                <div className='delivery'>
                                    <div>
                                        <span className='left'>Vận chuyển</span>
                                        <span className='right'>Miễn phí vận chuyển</span>
                                    </div>
                                </div>
                                <div className='quantity'>
                                    <span className='left'>Số lượng</span>
                                    <span className='right'>
                                        <button onClick={() => handleChangeButton('MINUS')}><MinusOutlined /></button>
                                        <input onChange={(event) => handleChangeInput(event.target.value)} value={currentQuantity} />
                                        <button onClick={() => handleChangeButton('PLUS')}><PlusOutlined /></button>
                                    </span>
                                </div>
                                <div className='buy'>
                                    <button className='cart' onClick={() => handleAddToCart()}>
                                        <BsCartPlus className='icon-cart' />
                                        <span>Thêm vào giỏ hàng</span>
                                    </button>
                                    <button className='now'>Mua ngay</button>
                                </div>
                            </Col>
                        </Col>
                    </Row>
                </div>
            </div>
            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                currentIndex={currentIndex}
                items={imageGallery}
                title={currentBook?.mainText ?? ""}
            />
        </div>
    )
}