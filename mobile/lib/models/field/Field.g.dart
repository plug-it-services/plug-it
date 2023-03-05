// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'Field.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Field _$FieldFromJson(Map<String, dynamic> json) => Field(
    key: json['key'] as String,
    type: json['type'] as String,
    displayName: json['displayName'] as String,
    required: json['required'] as bool,
    description: json['description'] as String);

Map<String, dynamic> _$FieldToJson(Field instance) => <String, dynamic>{
      'key': instance.key,
      'type': instance.type,
      'displayName': instance.displayName,
      'required': instance.required,
      'description': instance.description,
    };
