// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'Variable.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Variable _$VariableFromJson(Map<String, dynamic> json) => Variable(
      key: json['key'] as String,
      type: json['type'] as String,
      displayName: json['displayName'] as String,
      description: json['description'] as String,
    );

Map<String, dynamic> _$VariableToJson(Variable instance) => <String, dynamic>{
      'key': instance.key,
      'type': instance.type,
      'displayName': instance.displayName,
      'description': instance.description,
    };
