import 'package:json_annotation/json_annotation.dart';
import 'package:mobile/models/types.dart';

part 'FieldInput.g.dart';

@JsonSerializable()
class FieldInput {
  String key, value;

  FieldInput({required this.key, required this.value});

  factory FieldInput.fromJson(Json json) => _$FieldInputFromJson(json);

  Json toJson() => _$FieldInputToJson(this);
}