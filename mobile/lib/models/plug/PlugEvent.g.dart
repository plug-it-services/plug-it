// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'PlugEvent.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PlugEvent _$PlugEventFromJson(Map<String, dynamic> json) => PlugEvent(
      id: json['id'] as String,
      serviceName: json['serviceName'] as String,
      fields: (json['fields'] as List<dynamic>)
          .map((e) => FieldInput.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$PlugEventToJson(PlugEvent instance) => <String, dynamic>{
      'id': instance.id,
      'serviceName': instance.serviceName,
      'fields': instance.fields,
    };
