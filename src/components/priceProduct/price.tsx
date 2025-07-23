import './price.css'

export function Price() {
    return (
        <div className="modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Digite os preços dos produtos</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <fieldset className="d-flex gap-3 pt-2">
                            <legend>1 por</legend>
                            <input
                                type="text"
                                name="quantity"
                                id="quantity"
                                placeholder="0"
                            />
                            <legend>2 por</legend>
                            <input
                                type="text"
                                name="quantity"
                                id="quantity"
                                placeholder="0"
                            />
                        </fieldset>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    )
}