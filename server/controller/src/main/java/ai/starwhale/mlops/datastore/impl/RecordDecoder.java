/*
 * Copyright 2022 Starwhale, Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package ai.starwhale.mlops.datastore.impl;

import ai.starwhale.mlops.datastore.ColumnSchemaDesc;
import ai.starwhale.mlops.datastore.ColumnSchemaDesc.KeyValuePairSchema;
import ai.starwhale.mlops.datastore.ColumnType;
import ai.starwhale.mlops.datastore.TableSchemaDesc;
import ai.starwhale.mlops.datastore.type.BaseValue;
import ai.starwhale.mlops.datastore.type.BoolValue;
import ai.starwhale.mlops.datastore.type.BytesValue;
import ai.starwhale.mlops.datastore.type.Float32Value;
import ai.starwhale.mlops.datastore.type.Float64Value;
import ai.starwhale.mlops.datastore.type.Int16Value;
import ai.starwhale.mlops.datastore.type.Int32Value;
import ai.starwhale.mlops.datastore.type.Int64Value;
import ai.starwhale.mlops.datastore.type.Int8Value;
import ai.starwhale.mlops.datastore.type.ListValue;
import ai.starwhale.mlops.datastore.type.MapValue;
import ai.starwhale.mlops.datastore.type.ObjectValue;
import ai.starwhale.mlops.datastore.type.ScalarValue;
import ai.starwhale.mlops.datastore.type.StringValue;
import ai.starwhale.mlops.datastore.type.TupleValue;
import ai.starwhale.mlops.exception.SwValidationException;
import java.nio.ByteBuffer;
import java.text.MessageFormat;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.NonNull;

public class RecordDecoder {

    public static Map<String, BaseValue> decodeRecord(TableSchemaDesc recordSchema,
            @NonNull Map<String, Object> record) {
        var ret = new HashMap<String, BaseValue>();
        var colMap = recordSchema.getColumnSchemaList().stream()
                .collect(Collectors.toMap(ColumnSchemaDesc::getName, Function.identity()));
        for (var entry : record.entrySet()) {
            var name = entry.getKey();
            if (name.equals(MemoryTableImpl.DELETED_FLAG_COLUMN_NAME)) {
                ret.put(MemoryTableImpl.DELETED_FLAG_COLUMN_NAME, BoolValue.TRUE);
                continue;
            }
            var value = entry.getValue();
            var columnSchema = colMap.get(name);
            try {
                ret.put(name, RecordDecoder.decodeValue(columnSchema, value));
            } catch (Exception e) {
                throw new SwValidationException(SwValidationException.ValidSubject.DATASTORE,
                        MessageFormat.format("failed to decode value {0} for column {1}",
                                value,
                                name),
                        e);
            }
        }
        return ret;
    }

    public static BaseValue decodeValue(@NonNull ColumnSchemaDesc columnSchema, Object value) {
        if (value == null) {
            return null;
        }
        ColumnType type = ColumnType.valueOf(columnSchema.getType());
        switch (type) {
            case LIST:
                return RecordDecoder.decodeList(columnSchema, value);
            case TUPLE:
                return RecordDecoder.decodeTuple(columnSchema, value);
            case MAP:
                return RecordDecoder.decodeMap(columnSchema, value);
            case OBJECT:
                return RecordDecoder.decodeObject(columnSchema, value);
            default:
                return RecordDecoder.decodeScalar(type, value);
        }
    }

    public static ScalarValue decodeScalar(@NonNull ColumnType type, Object value) {
        if (value == null) {
            return null;
        }
        switch (type) {
            case BOOL:
                if (value.equals("1")) {
                    return BoolValue.TRUE;
                } else if (value.equals("0")) {
                    return BoolValue.FALSE;
                }
                throw new IllegalArgumentException("invalid bool value " + value);
            case INT8:
                return new Int8Value((byte) (Integer.parseUnsignedInt((String) value, 16) & 0xFF));
            case INT16:
                return new Int16Value((short) (Integer.parseUnsignedInt((String) value, 16) & 0xFFFF));
            case INT32:
                return new Int32Value(Integer.parseUnsignedInt((String) value, 16));
            case INT64:
                return new Int64Value(Long.parseUnsignedLong((String) value, 16));
            case FLOAT32:
                return new Float32Value(Float.intBitsToFloat(Integer.parseUnsignedInt((String) value, 16)));
            case FLOAT64:
                return new Float64Value(Double.longBitsToDouble(Long.parseUnsignedLong((String) value, 16)));
            case STRING:
                return new StringValue((String) value);
            case BYTES:
                return new BytesValue(ByteBuffer.wrap(Base64.getDecoder().decode((String) value)));
            default:
                throw new IllegalArgumentException("invalid type " + type);
        }
    }

    private static ListValue decodeList(@NonNull ColumnSchemaDesc columnSchema, Object value) {
        var ret = new ListValue();
        var elements = (List<?>) value;
        var sparse = new HashMap<Integer, ColumnSchemaDesc>();
        if (columnSchema.getAttributes() != null) {
            for (var attr : columnSchema.getAttributes()) {
                sparse.put(attr.getIndex(), attr);
            }
        }
        for (var i = 0; i < elements.size(); i++) {
            var type = sparse.get(i);
            if (type == null) {
                type = columnSchema.getElementType();
            }
            ret.add(RecordDecoder.decodeValue(type, elements.get(i)));
        }
        return ret;
    }

    private static TupleValue decodeTuple(@NonNull ColumnSchemaDesc columnSchema, Object value) {
        var ret = new TupleValue();
        ret.addAll(RecordDecoder.decodeList(columnSchema, value));
        return ret;
    }

    private static MapValue decodeMap(@NonNull ColumnSchemaDesc columnSchema, Object value) {
        var ret = new MapValue();

        if (value instanceof List) {
            var items = (List<?>) value;
            for (int i = 0; i < items.size(); i++) {
                var item = (List<?>) items.get(i);
                ColumnSchemaDesc.KeyValuePairSchema pairType = null;
                if (columnSchema.getSparseKeyValuePairSchema() != null) {
                    pairType = columnSchema.getSparseKeyValuePairSchema().get(i);
                }
                if (pairType == null) {
                    pairType = new KeyValuePairSchema(columnSchema.getKeyType(), columnSchema.getValueType());
                }
                ret.put(RecordDecoder.decodeValue(pairType.getKeyType(), item.get(0)),
                        RecordDecoder.decodeValue(pairType.getValueType(), item.get(1)));
            }
        } else {
            for (var entry : ((Map<?, ?>) value).entrySet()) {
                ret.put(RecordDecoder.decodeValue(columnSchema.getKeyType(), entry.getKey()),
                        RecordDecoder.decodeValue(columnSchema.getValueType(), entry.getValue()));
            }
        }
        return ret;
    }

    private static ObjectValue decodeObject(@NonNull ColumnSchemaDesc columnSchema, Object value) {
        var pythonType = columnSchema.getPythonType();
        var ret = new ObjectValue(pythonType);
        var attrMap = columnSchema.getAttributes().stream()
                .collect(Collectors.toMap(ColumnSchemaDesc::getName, Function.identity()));
        for (var entry : ((Map<?, ?>) value).entrySet()) {
            String attrName = (String) entry.getKey();
            if (!MemoryTableImpl.ATTRIBUTE_NAME_PATTERN.matcher(attrName).matches()) {
                throw new IllegalArgumentException(
                        "invalid attribute name " + attrName
                                + ". only alphabets, digits, and underscore are allowed");
            }
            ret.put(attrName,
                    RecordDecoder.decodeValue(attrMap.get(attrName), entry.getValue()));
        }
        return ret;
    }
}
