class TypeMap extends Map {
    constructor(keyType, valueType){
        super()
        this._keyType = keyType;
        this._valueType = valueType;
    }
    _matchesType(key,value){
        return (typeof(key) === this._keyType) && (typeof(value) === this._valueType);
    }
    set(key, value){
        if(!this._matchesType(key,value)) {
            function MapTypeMismatchException() {
                const error = new Error('An unmatching type was tried to be set to a TypeMap.');

                error.code = "MAP_TYPE_MISMATCH_EXCEPTION";
                error.name = 'MapTypeMismatchException';

                return error;
            }
        MapTypeMismatchException.prototype = Object.create(Error.prototype);

        throw MapTypeMismatchException();
        }
        super.set(key,value)
    }  
}

module.exports = {
    TypeMap
};
