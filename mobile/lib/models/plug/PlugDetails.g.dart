// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'PlugDetails.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PlugDetails _$PlugDetailsFromJson(Map<String, dynamic> json) => PlugDetails(
      id: json['id'] as String,
      name: json['name'] as String,
      event: PlugEvent.fromJson(json['event'] as Map<String, dynamic>),
      enabled: json['enabled'] as bool,
      actions: (json['actions'] as List<dynamic>)
          .map((e) => PlugEvent.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$PlugDetailsToJson(PlugDetails instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'enabled': instance.enabled,
      'event': instance.event,
      'actions': instance.actions,
    };
